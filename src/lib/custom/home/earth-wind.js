import reglCamera from 'regl-camera';

/**
 * Earth, Wind, but no Fire
 */

// //////////////////////////////////////////////////////////////////

const sphereMeshFn = (radius, nphi, ntheta) => {
  const vertices = [];
  const faces = [];
  const uvs = [];
  const normals = [];
  for (let i = 0; i <= nphi; i += 1) {
    const phi = (Math.PI / nphi) * i;
    for (let j = 0; j <= ntheta; j += 1) {
      const theta = ((Math.PI * 2) / ntheta) * j;
      const normal = [
        Math.sin(phi) * Math.cos(theta), Math.sin(phi) * Math.sin(theta), Math.cos(phi),
      ];
      normals.push(normal);
      vertices.push(normal.map((x) => x * radius));
      uvs.push([1 - (j / ntheta), (i / nphi)]);
      if (i < nphi && j < ntheta) {
        faces.push(
          [i * (ntheta + 1) + j, (i + 1) * (ntheta + 1) + j, (i + 1) * (ntheta + 1) + j + 1],
          [i * (ntheta + 1) + j, (i + 1) * (ntheta + 1) + j + 1, i * (ntheta + 1) + j + 1],
        );
      }
    }
  }
  return {
    vertices, faces, uvs, normals,
  };
};

// The sphere mesh of the earth
const sphereMesh = sphereMeshFn(1, 30, 60);

const rampColors = ({
  0.0: '#3288bd',
  0.1: '#66c2a5',
  0.2: '#abdda4',
  0.3: '#e6f598',
  0.4: '#fee08b',
  0.5: '#fdae61',
  0.6: '#f46d43',
  1.0: '#d53e4f',
});

const resolution = 192;

const getColorRamp = (colors) => {
  const colorRampCanvas = document.createElement('canvas');
  colorRampCanvas.width = 256;
  colorRampCanvas.height = 1;
  const ctx = colorRampCanvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, 256, 0);
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const stop in colors) gradient.addColorStop(+stop, colors[stop]);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 1);

  return new Uint8Array(ctx.getImageData(0, 0, 256, 1).data);
};

const numberOfParticles = resolution ** 2;
const particleState = new Uint8Array(numberOfParticles * 4)
  .fill(null)
  .map(() => Math.floor(Math.random() * 256)); // randomize the initial particle positions

// //////////////////////////////////////////////////////////////////

export default (regl, texEarth, texWind, windData, canvas) => {
  const colorRampTexture = regl.texture({
    data: getColorRamp(rampColors),
    width: 16,
    height: 16,
    mag: 'linear',
    min: 'linear',
  });

  const particleStateTextures = [
    regl.texture({
      data: particleState,
      width: resolution,
      height: resolution,
      mag: 'nearest',
      min: 'nearest',
    }),
    regl.texture({
      data: particleState,
      width: resolution,
      height: resolution,
      mag: 'nearest',
      min: 'nearest',
    }),
  ];

  const framebuffer = regl.framebuffer({
    depthStencil: false,
    colorCount: 1,
    colorFormat: 'rgba',
    colorType: 'uint8',
  });

  const quadBuffer = regl.buffer(new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]));

  const particleIndices = new Float32Array(numberOfParticles);
  for (let i = 0; i < numberOfParticles; i += 1) { particleIndices[i] = i; }
  const particleIndexBuffer = regl.buffer(particleIndices);

  const updateParticles = regl({
    frag: `
      precision highp float;
      
      uniform sampler2D u_particles;
      uniform sampler2D u_wind;
      uniform vec2 u_wind_res;
      uniform vec2 u_wind_min;
      uniform vec2 u_wind_max;
      uniform float u_rand_seed;
      uniform float u_speed_factor;
      uniform float u_drop_rate;
      uniform float u_drop_rate_bump;
      
      varying vec2 v_tex_pos;
      
      const vec2 bitEnc = vec2(1.,255.);
      const vec2 bitDec = 1./bitEnc;
      
      // decode particle position from pixel RGBA
      vec2 fromRGBA(const vec4 color) {
        vec4 rounded_color = floor(color * 255.0 + 0.5) / 255.0;
        float x = dot(rounded_color.rg, bitDec);
        float y = dot(rounded_color.ba, bitDec);
        return vec2(x, y);
      }
      
      // encode particle position to pixel RGBA
      vec4 toRGBA (const vec2 pos) {
        vec2 rg = bitEnc * pos.x;
        rg = fract(rg);
        rg -= rg.yy * vec2(1. / 255., 0.);
      
        vec2 ba = bitEnc * pos.y;
        ba = fract(ba);
        ba -= ba.yy * vec2(1. / 255., 0.);
      
        return vec4(rg, ba);
      }
      
      // pseudo-random generator
      const vec3 rand_constants = vec3(12.9898, 78.233, 4375.85453);
      float rand(const vec2 co) {
        float t = dot(rand_constants.xy, co);
        return fract(sin(t) * (rand_constants.z + t));
      }
  
      // wind speed lookup; use manual bilinear filtering based on 4 adjacent pixels for smooth interpolation
      vec2 lookup_wind(const vec2 uv) {
        // return texture2D(u_wind, uv).rg; // lower-res hardware filtering
        vec2 px = 1.0 / u_wind_res;
        vec2 vc = (floor(uv * u_wind_res)) * px;
        vec2 f = fract(uv * u_wind_res);
        vec2 tl = texture2D(u_wind, vc).rg;
        vec2 tr = texture2D(u_wind, vc + vec2(px.x, 0)).rg;
        vec2 bl = texture2D(u_wind, vc + vec2(0, px.y)).rg;
        vec2 br = texture2D(u_wind, vc + px).rg;
        return mix(mix(tl, tr, f.x), mix(bl, br, f.x), f.y);
      }
    
      void main() {
        vec4 color = texture2D(u_particles, v_tex_pos);
    
        vec2 pos = fromRGBA(color);
    
        vec2 velocity = mix(u_wind_min, u_wind_max, lookup_wind(pos));
        float speed_t = length(velocity) / length(u_wind_max);
    
        // take EPSG:4236 distortion into account for calculating where the particle moved
        float distortion = 1.0; //cos(radians(pos.y * 180.0 - 90.0));
        vec2 offset = vec2(velocity.x / distortion, -velocity.y) * 0.0001 * u_speed_factor;
    
        // update particle position, wrapping around the date line
        pos = fract(1.0 + pos + offset);
    
        // a random seed to use for the particle drop
        vec2 seed = (pos + v_tex_pos) * u_rand_seed;
    
        // drop rate is a chance a particle will restart at random position, to avoid degeneration
        float drop_rate = u_drop_rate + speed_t * u_drop_rate_bump;
        float drop = step(1.0 - drop_rate, rand(seed));
    
        vec2 random_pos = vec2(
            rand(seed + 1.3),
            rand(seed + 2.1));
        pos = mix(pos, random_pos, drop);
    
        // encode the new particle position back into RGBA
        gl_FragColor = toRGBA(pos);
      }`,

    vert: `
      precision mediump float;
      attribute vec2 a_pos;
      varying vec2 v_tex_pos;
      
      void main() {
        v_tex_pos = a_pos;
        gl_Position = vec4(1.0 - 2.0 * a_pos, 0, 1);
      }`,

    primitive: 'triangles',
    count: 6,

    viewport: {
      width: resolution,
      height: resolution,
    },

    depth: {
      enable: false,
    },
    stencil: {
      enable: false,
    },

    attributes: {
      a_pos: regl.prop('quadBuffer'),
    },

    uniforms: {
      u_wind: regl.prop('windTexture'),
      u_particles: regl.prop('particleStateTexture'),

      u_rand_seed: () => Math.random(),
      u_wind_res: regl.prop('windRes'),
      u_wind_min: regl.prop('windMin'),
      u_wind_max: regl.prop('windMax'),
      u_speed_factor: regl.prop('speedFactor'),
      u_drop_rate: regl.prop('dropRate'),
      u_drop_rate_bump: regl.prop('dropRateBump'),
    },
  });

  const updateParticleTexture = () => {
    framebuffer({ color: particleStateTextures[1] });

    framebuffer.use(() => {
      updateParticles({
        quadBuffer,
        windTexture: regl.texture(texWind),
        particleStateTexture: particleStateTextures[0],
        windRes: [windData.width, windData.height],
        windMin: [windData.uMin, windData.vMin],
        windMax: [windData.uMax, windData.vMax],
        speedFactor: 0.25,
        dropRate: 0.003,
        dropRateBump: 0.01,
      });
    });

    // swap the particle state textures so the new one becomes the current one
    const temp = particleStateTextures[0];
    // eslint-disable-next-line prefer-destructuring
    particleStateTextures[0] = particleStateTextures[1];
    particleStateTextures[1] = temp;
  };

  // //////////////////////////////////////////////////////////////////

  const emptyPixels = new Uint8Array(canvas.width * canvas.height * 4);
  const screenTextures = [
    // Screen textures to hold the drawn screen for the previous and the current frame
    regl.texture({
      data: emptyPixels,
      mag: 'nearest',
      min: 'nearest',
      width: canvas.width,
      height: canvas.height,
    }),
    regl.texture({
      data: emptyPixels,
      mag: 'nearest',
      min: 'nearest',
      width: canvas.width,
      height: canvas.height,
    }),
  ];

  const drawParticleTexture = regl({
    primitive: 'points',
    count: numberOfParticles,

    viewport: {
      width: canvas.width,
      height: canvas.height,
    },

    depth: {
      enable: false,
    },
    stencil: {
      enable: false,
    },

    vert: `
      precision highp float;
      
      attribute float a_index;
      
      uniform sampler2D u_particles;
      uniform float u_particles_res;
      
      varying vec2 v_particle_pos;
      
      const vec2 bitEnc = vec2(1.,255.);
      const vec2 bitDec = 1./bitEnc;
      
      // decode particle position from pixel RGBA
      vec2 fromRGBA(const vec4 color) {
        vec4 rounded_color = floor(color * 255.0 + 0.5) / 255.0;
        float x = dot(rounded_color.rg, bitDec);
        float y = dot(rounded_color.ba, bitDec);
        return vec2(x, y);
      }
       
      void main() {
        vec4 color = texture2D(u_particles, vec2(
          fract(a_index / u_particles_res),
          floor(a_index / u_particles_res) / u_particles_res));
      
        // decode current particle position from the pixel's RGBA value
        v_particle_pos = fromRGBA(color);
      
        gl_PointSize = 1.0;
        gl_Position = vec4(2.0 * v_particle_pos.x - 1.0, 1.0 - 2.0 * v_particle_pos.y, 0, 1);
      }`,

    frag: `
      precision highp float;
  
      uniform sampler2D u_wind;
      uniform vec2 u_wind_min;
      uniform vec2 u_wind_max;
      uniform sampler2D u_color_ramp;
      
      varying vec2 v_particle_pos;
      
      void main() {
        vec2 velocity = mix(u_wind_min, u_wind_max, texture2D(u_wind, v_particle_pos).rg);
        float speed_t = length(velocity) / length(u_wind_max);
      
        // color ramp is encoded in a 16x16 texture
        vec2 ramp_pos = vec2(
          fract(16.0 * speed_t),
          floor(16.0 * speed_t) / 16.0);
      
        gl_FragColor = texture2D(u_color_ramp, ramp_pos);
      }`,

    attributes: {
      a_index: regl.prop('particleIndexBuffer'),
    },

    uniforms: {
      u_wind: regl.prop('windTexture'),
      u_particles: regl.prop('particleStateTexture'),
      u_color_ramp: regl.prop('colorRampTexture'),

      u_particles_res: regl.prop('particleStateResolution'),
      u_wind_min: regl.prop('windMin'),
      u_wind_max: regl.prop('windMax'),
    },
  });

  const drawScreenTexture = regl({
    frag: `
      precision highp float;
  
      uniform sampler2D u_screen;
      uniform float u_opacity;
  
      varying vec2 v_tex_pos;
  
      void main() {
        vec4 color = texture2D(u_screen, 1.0 - v_tex_pos);
        // a hack to guarantee opacity fade out even with a value close to 1.0
        gl_FragColor = vec4(floor(255.0 * color * u_opacity) / 255.0);
      }`,

    vert: `
      precision mediump float;
      attribute vec2 a_pos;
      varying vec2 v_tex_pos;
  
      void main() {
        v_tex_pos = a_pos;
        gl_Position = vec4(1.0 - 2.0 * a_pos, 0, 1);
      }`,

    blend: {
      enable: regl.prop('blend'),
      func: {
        srcRGB: 'src alpha',
        srcAlpha: 1,
        dstRGB: 'one minus src alpha',
        dstAlpha: 1,
      },
    },

    viewport: {
      width: canvas.width,
      height: canvas.height,
    },

    depth: {
      enable: false,
    },

    stencil: {
      enable: false,
    },

    attributes: {
      a_pos: regl.prop('quadBuffer'),
    },

    uniforms: {
      u_opacity: regl.prop('opacity'),
      u_screen: regl.prop('texture'),
    },

    primitive: 'triangles',
    count: 6,
  });

  const updateParticleScreen = () => {
    const backgroundTexture = screenTextures[0];
    const screenTexture = screenTextures[1];

    // draw the screen into a temporary framebuffer to retain it as the background on the next frame
    framebuffer({ color: screenTexture });

    framebuffer.use(() => {
      drawScreenTexture({
        texture: backgroundTexture, blend: false, opacity: 0.95, quadBuffer,
      });
      drawParticleTexture({
        particleStateResolution: resolution,
        windMin: [windData.uMin, windData.vMin],
        windMax: [windData.uMax, windData.vMax],
        colorRampTexture,
        particleStateTexture: particleStateTextures[0],
        windTexture: regl.texture(texWind),
        particleIndexBuffer,
      });
    });

    // save the current screen as the background for the next frame
    const temp = backgroundTexture;
    screenTextures[0] = screenTexture;
    screenTextures[1] = temp;
  };

  // //////////////////////////////////////////////////////////////////

  const drawGlobe = regl({
    frag: `
      precision mediump float;
      varying vec2 vertex;
      uniform sampler2D tex, texScreen;
  
      void main () {
        gl_FragColor = texture2D(tex, vertex) + texture2D(texScreen, vec2(vertex.x, 1.0 - vertex.y)) / 1.4;
      }`,

    vert: `
      precision mediump float;
      attribute vec2 uv;
      attribute vec3 position;
      varying vec2 vertex;
      uniform float tick;
      uniform vec3 axis;
      uniform mat4 projection, view;
      const float PI = 3.14159;
  
      vec3 quatRotate(vec3 v){
        float turn = -0.05 * tick * PI / 180.0;
        vec4 q = vec4(axis * sin(turn), cos(turn));
        return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
      }
  
      void main () {
        vertex = uv.xy;
        gl_Position = projection * view * vec4(quatRotate(position.xzy), 1.0);
      }`,

    attributes: {
      position: sphereMesh.vertices,
      uv: sphereMesh.uvs,
    },

    uniforms: {
      tex: regl.texture(texEarth),
      texScreen: regl.prop('texScreen'),
      tick: regl.prop('tick'),
      axis: [0.0, 1.0, 0.0],
    },

    elements: sphereMesh.faces,
  });

  // The current tick of the animation
  let tick = 0;

  const camera = reglCamera(regl, {
    center: [0, 0, 0],
    theta: -Math.PI / 2,
    phi: Math.PI / 12,
    distance: 3.5,
    damping: 0.5,
    renderOnDirty: false,
    zoomSpeed: 0,
    mouse: false,
  });

  // Continuously updates
  regl.frame(() => {
    camera(() => {
      // Clears the canvas first
      regl.clear({ color: [0, 0, 0, 0] });

      // Get the next particle textures
      updateParticleTexture();
      updateParticleScreen();

      // Draws the background globe
      drawGlobe({ tick, texScreen: screenTextures[0] });

      // Increments tick
      tick += 1;
    });
  });
};
