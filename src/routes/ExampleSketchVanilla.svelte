<script lang="ts">
  import { onMount } from 'svelte';
  import { spring } from 'svelte/motion';
  import { pick, random } from '../lib/util';

  const w = 200;
  const h = 200;
  const margin = 50;

  let desiredSize = 50;
  const actualSize = spring(50, {
    stiffness: 0.1,
    damping: 0.25
  });

  $: actualSize.set(desiredSize);
  $: s = ($actualSize / 100) * (w - margin);

  const r = random(0, 255);
  const g = random(0, 255);
  const b = random(0, 255);

  const emoji = pick(['🤓', '🤔', '🤡']);
  const url = `https://emojicdn.elk.sh/${emoji}?style=google`;

  let canvas: HTMLCanvasElement;

  onMount(() => {
    const image = new Image();
    image.src = url;

    const ctx = canvas.getContext('2d')!;
    let frame: number;

    (function loop() {
      frame = requestAnimationFrame(loop);

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(0, 0, w, h);

      ctx.drawImage(image, w / 2 - s / 2, h / 2 - s / 2, s, s);
    })();

    return () => {
      cancelAnimationFrame(frame);
    };
  });
</script>

<label>
  Size
  <input
    type="range"
    min="1"
    max="100"
    value={$actualSize}
    on:input={(e) => {
      desiredSize = parseInt(e.currentTarget.value);
    }}
  />
  {desiredSize}
</label>

<br />

<canvas
  bind:this={canvas}
  width={w}
  height={h}
  on:click={() => {
    desiredSize = 50;
  }}
/>
