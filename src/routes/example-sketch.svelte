<script lang="ts">
  import type { Image, Renderer } from 'p5';
  import P5, { type Sketch } from 'p5-svelte';
  let size = 50;

  const sketch: Sketch = (p5) => {
    const w = 200;
    const h = 200;
    const margin = 50;

    const r = p5.random(0, 255);
    const g = p5.random(0, 255);
    const b = p5.random(0, 255);

    const emoji = p5.random(['🤓', '🤔', '🤡']);
    const url = `https://emojicdn.elk.sh/${emoji}?style=google`;

    let canvas: Renderer;
    let img: Image;

    p5.preload = function () {
      img = p5.loadImage(url);
    };

    p5.setup = function () {
      canvas = p5.createCanvas(w, h);
      canvas.mouseClicked(function () {
        size = 50;
      });
    };

    p5.draw = function () {
      p5.background(r, g, b);

      const s = (size / 100) * (w - margin);
      p5.imageMode(p5.CENTER);
      p5.image(img, w / 2, h / 2, s, s);
    };

    // non va bene perchè il listener è su window e non sull'elemento dello sketch
    // p5.mouseClicked = function () {
    //   size = 50;
    // };
  };
</script>

<label>
  Size
  <input type="range" bind:value={size} min="1" max="100" />
  {size}
</label>

<P5 {sketch} />
