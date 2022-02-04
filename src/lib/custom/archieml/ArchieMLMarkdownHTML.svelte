<script>
  import archieml from 'archieml';
  import { marked } from 'marked';
  import DOMPurify from 'dompurify';
  import YAML from 'js-yaml';
  import { browser } from '$app/env';

  export let types = ['ArchieML', 'JSON'];
  export let value;

  const valueFunctions = {
    default: (v) => v,
    json: (v) => JSON.stringify(archieml.load(v), null, 2),
    html: (v) => {
      let inputTrimmed = v.trim();
      const hasFrontmatterStart = inputTrimmed.indexOf('---') === 0;
      const frontmatterEnd = inputTrimmed.indexOf('---', 3);
      if (hasFrontmatterStart && (frontmatterEnd > 3)) {
        inputTrimmed = inputTrimmed.slice(frontmatterEnd + 3);
      }
      const rawHTML = marked.parse(inputTrimmed);
      return browser ? DOMPurify.sanitize(rawHTML) : rawHTML;
    },
    frontmatter: (v) => {
      const inputTrimmed = v.trim();
      const hasFrontmatterStart = inputTrimmed.indexOf('---') === 0;
      const frontmatterEnd = inputTrimmed.indexOf('---', 3);
      if (hasFrontmatterStart && (frontmatterEnd > 3)) {
        const frontmatter = inputTrimmed.slice(3, frontmatterEnd).trim();
        return JSON.stringify(YAML.load(frontmatter), null, 2);
      }
      return '{}';
    },
    'html & data': (v) => {
      const { content, ...restProps } = archieml.load(v);

      let outputHTML = `<code>${JSON.stringify(restProps, null, 2)}</code><hr />`;

      content.forEach((block) => {
        if (block.type === 'text') {
          const rawHTML = marked.parse(block.value.value || block.value);
          outputHTML += browser ? DOMPurify.sanitize(rawHTML) : rawHTML;
        } else {
          outputHTML += `<code>${JSON.stringify(block, null, 2)}</code>`;
        }
      });

      return outputHTML;
    },
  };

  let textareaHeight = 0;
  let textarea;

  $: {
    // Automatically increases the height of the textarea
    if (value && textarea) {
      textareaHeight = Math.min(textarea.scrollHeight, 500);
    }
  }
</script>

<style lang="scss">
  div.wrapper {
    @include full-offset-cols;
    margin: 16px 0 48px;
    display: grid;
    grid-template-columns: repeat(var(--num-columns), 1fr);
    grid-template-rows: auto auto;
    grid-column-gap: 20px;
    grid-auto-flow: column;

    &.max {
      grid-column: 1 / 13;
    }
  }

  code, textarea, .html-wrapper > :global(code) {
    line-height: 1.6em;
    white-space: pre-wrap;
    background-color: var(--background-color-secondary);
    padding: 16px;
    transition: all 0.5s;
    display: block;
    border: none;
    outline: none;
    color: var(--color);
    font-family: 'Roboto Mono', monospace;
    font-size: 16px;
    width: 100%;
    height: 100%;
    resize: none;
  }

  .html-wrapper > :global(code) {
    padding: 8px 16px;
    height: auto;
  }

  @media screen and (max-width: $device-small) {
    div.wrapper {
      display: block;
    }

    code, textarea {
      height: auto;
    }

    .html-wrapper > :global(code) {
      border-left: 2px solid var(--color);
    }

    .html-wrapper {
      background-color: var(--background-color-secondary);
      padding: 16px;
    }
  }
</style>

<div class="wrapper" class:max={types.length > 2} style:--num-columns={types.length}>
  <h3>{types[0]} (editable)</h3>
  <textarea
    bind:value
    bind:this={textarea}
    style:min-height="{textareaHeight}px"
  />

  {#each types.slice(1) as type}
    <h3>{type} (output)</h3>
    {#if type.toLowerCase().indexOf('html') >= 0}
      <div class="html-wrapper">
        {@html (valueFunctions[type.toLowerCase()] || valueFunctions.default)(value)}
      </div>
    {:else}
      <code>
        {@html (valueFunctions[type.toLowerCase()] || valueFunctions.default)(value)}
      </code>
    {/if}
  {/each}
</div>
