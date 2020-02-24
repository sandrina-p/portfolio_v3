<script>
  import { onMount, createEventDispatcher } from 'svelte';
  import skills from '../../data/skills.js';
  import { matchMq } from '../../stores/responsive.js';
  import { sendGA } from '../../utils';

	const dispatch = createEventDispatcher();
  const colorTypes = {
    '0': 'var(--primary_1)',
    '1': 'var(--primary_2)',
    '2': 'var(--primary_3)',
    '3': 'var(--primary_4)',
  };
  const sortByLevel = (() => {
    const lists = Array.from(Array(Object.keys(skills.lists).length), () => []);
    
    for(let tool of skills.tools) {
      tool.list.forEach(listIndex => {
        return lists[listIndex].push(tool)
      })
    }

    return lists
  })();
  let lvlActive = '0';
  let interactedWith = { '0': true };
  let clickPath = '0' // navigation path to send to GA
  $: hadClickInAll = !!interactedWith[3] || Object.keys(interactedWith).length > 2;

  onMount(() => {
    dispatch('setColorType', {
      colorType: colorTypes['0']
    });
  })

  function updateSkill(id) {
    interactedWith[id] = true;
    lvlActive = id;

    dispatch('setColorType', {
      colorType: colorTypes[id]
    });
    const newPath = clickPath + '_' + id;
    clickPath = newPath
    sendGA('send', 'event', 'click', 'skills', newPath);
  }

  function handlePointClick(list) {
    if($matchMq.lg) {
      updateSkill(list[0])
    }
  }
</script>

<style>
  @define-mixin motionDefault { :global(.jsMotionDefault) & { @mixin-content; } }
  @define-mixin motionReduced { :global(.jsMotionReduced) & { @mixin-content; } }

  $gutter: calc($layout-margin*2);

  .main {
    position: relative;
    width: 100%;
    max-width: 90rem;
    margin: 0 auto;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-bottom: calc($layout-margin * 2);
    color: var(--text_invert);

    :global(.dark) & {
      color: var(--text_0);
    }

    @media (--max-lg) {
      &::before { /* slider shadow */
        content: '';
        position: absolute;
        top: 0;
        left: 100vw;
        height: 100%;
        width: calc($layout-margin*2);
        z-index: 1; /* above content */
        pointer-events: none;
        transform: translateX(-100%);
        background: linear-gradient(to left, var(--bg_invert), var(--bg_invert_transparent));
        visibility: hidden;
        opacity: 0;
        
        :global(.uAppear) & {
          /* avoid a weird clash of colors on fade in/out */
          transition: visibility 0ms 100ms, opacity 100ms 100ms;
          visibility: visible;
          opacity: 1;
        }
      }
    }
  }

  .tabList {
    display: none;
  }

  .skills {
    padding: $spacer-L $layout-margin;

    /* scroll margin on the end */
    &::after {
      display: block;
      width: 1px;
      height: 1px;
      content: '';
      scroll-snap-align: end;
      flex-shrink: 0;
    }

    &Title {
      position: relative;
      font-size: $font-XL;
      margin-bottom: $spacer-MS;
      line-height: 1;
      z-index: 0; /* so :before appears under */

      &::before {
        content: '';
        display: block;
        position: absolute;
        bottom: -0.2em;
        left: -0.2em;
        width: 100%;
        height: 0.5em;
        z-index: -1;
        opacity: 0.6;
        border-radius: 0.2rem;
        background-color: var(--colorType);
      }
    }

    &Lvl {
      width: calc(100vw - $layout-margin*5);
      max-width: 22rem;
      margin-right: $gutter;
    }

    @media(--max-lg) {
      /* Not worth mentioning on mobile */
      [data-tool='Git'],
      [data-tool='SEO'],
      [data-tool='Redux'],
      [data-tool='Webpack'],
      [data-tool='Gulp'],
      [data-tool='Figma'],
      [data-tool='Netlify'] {
        display: none;
      }
    }
  }

  .point {
    position: relative;
    width: calc(33.333% - $spacer-M);
    margin: 0 $spacer-M $spacer-M 0;
    padding-left: $spacer-MS;
    white-space: nowrap;

    &Text {
      display: inline-block;
    }

    &Orbite {
      display: block;
      position: absolute;
      top: 0.7rem;
      left: 0;
      width: 1.1rem;
      height: 1.1rem;
      animation: rotateOrbite 15s infinite linear;
      animation-play-state: paused;
      transform-origin: 50% 50%;
    }

    &Rotate,
    &Star {
      display: block;
      width: 100%;
      height: 100%;
      transform-origin: 50% 50%;
    }

    &Star {
      background-color: var(--colorType);
      cursor: zoom-in;
      border-radius: 0.4rem;
    }

    @for $i from 1 to 24 {
      &:nth-child($i) {
        .pointOrbite {
          /* TIL WOW discovery: Use @keyframes to create an animation.
            Use delay to start the animation at X point and use
            "animation-play-state:paused" to always stick there.
            And that's how we create random coordinates in a cleaner way */
          animation-delay: calc(1ms * random(-40000, 0));
        }

        .pointRotate {
          $reversed: random(0, 1);
          @if $reversed == 1 {
            animation-direction: reverse;
          }
        }

        @mixin motionDefault {
          &, /* blink animation */
          .pointRotate {
            animation-delay: calc(1ms * random(-40000, 0));
          }
  
          .pointText,
          .pointStar {
            transition-delay: calc(1ms * random(0, 250));
          }
        }
      }
    }
  }

  @media (--md) {
    .skillsLvl {
      margin-right: $layout-margin;
    }
  }

  @media (width: 64em) { /* exactly ipad horizontal */
    .skills {
      padding-right: calc($layout-margin/2);
      padding-left: calc($layout-margin/2 + $spacer-XL/2); /* visually ballanced */

      &::after {
        display: none;
      }
    }

    .skillsLvl {
      max-width: calc((100vw - ($layout-margin)) / 4);
      margin-right: 0;
      padding-right: $spacer-XL;
    }
  }

  @media (--lg) {
    .main {
      margin-top: $spacer-XL;
    }

    .tab {
      &List {
        display: flex;
        flex-direction: column;
        z-index: 1; /* to be above stars */
        padding: $spacer-XS;
        overflow: hidden; /* dont show scrollbar during entry animations */
      }

      &Btn {
        position: relative;
        font-size: $font-L;
        font-weight: 500;
        border: none;
        cursor: pointer;
        color: inherit;
        padding: $spacer-S $spacer-M;
        margin: 0 $spacer-M $spacer-M;
        background: transparent;
        border-radius: 0.3rem;
        white-space: nowrap;
        flex-shrink: 0;
        width: 14rem;
        margin: 0 0 $spacer-L;

        &::before {
          content: '';
          position: absolute;
          width: 100%;
          bottom: 0;
          left: 0;
          z-index: -1;
          height: 100%;
          border-radius: 0.3rem;
          background-color: var(--text_1);
          opacity: 0.5;
          transform: scale(1, 0.2);
          transform-origin: 0 75%;

          @mixin motionDefault {
            transition: background 250ms ease-out, transform 250ms ease-out;
          }
        }

        &:hover,
        &:focus {
          outline: none;
          color: var(--colorType);
        }

        &[aria-expanded='true'] {
          color: var(--text_0);
          
          :global(.dark) & {
            color: var(--text_invert);
          }

          &::before {
            opacity: 1;
            background-color: var(--colorType);
            transform: scale(1, 1);

            @mixin motionDefault {
              transition: transform 400ms cubic-bezier(0.28, 0.67, 0, 1.29);
            }
          }
        }

        opacity: 0;
        transform: translateY(1rem);
        transition: opacity 150ms ease-out, transform 150ms ease-out;

        :global(.uAppear) &.isVisible {
          opacity: 1;
          transform: translateY(0);
          transition:
            opacity 1000ms var(--delay, 75ms) cubic-bezier(0.0, 0.0, 0.2, 1),
            transform 1000ms var(--delay, 75ms) cubic-bezier(0.19, 1, 0.22, 1);

          $time: 75ms;

          &:nth-child(1) { --delay: calc(200ms + $time*1); }
          &:nth-child(2) { --delay: calc(200ms + $time*2); }
          &:nth-child(3) { --delay: calc(200ms + $time*3); }
          &:nth-child(3) { --delay: calc(200ms + $time*4); }

          @mixin motionReduced {
            transition: none;
          }
        }
      }
    }

    .skills {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      padding: 0;

      &Title {
        display: none;
      }

      &Lvl {
        &[data-level="this site"] {
          [data-tool] {
            /* so stars dont appear twice */
            display: none;
          }

          [data-tool="I'm on Github!"] { /* can't escape ' and ! */
            display: block;
            transform: translate(82rem, 8rem);
          }
        }
      }
    }

    @define-mixin coord $name, $x, $y {
      &[data-tool="$name"] {
        transform: translate($x, $y);
      }
    }

    @define-mixin ignore $name {
      &[data-tool="$name"] {
        display: none;
      }
    }

    .point {
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0.5;
      transition: opacity 250ms ease;
      width: auto;

      @mixin motionDefault {
        animation: blink 10s infinite ease;
      }

      &.isActive {
        opacity: 1;
        animation: none;
      }

      &Text {
        transform: scale(0);
        transform-origin: 0 50%;
        transition: transform 250ms ease-out;

        .isActive & {
          transition-timing-function: $animate-bounce;
          transform: scale(1);

          @mixin motionReduced {
            transition: none;
          }
        }
      }

      &Rotate {
        animation: rotateItself 20s infinite linear;

        :not(:global(.uAppear)) & {
          animation-play-state: paused;
        }

        @mixin motionReduced {
          animation-play-state: paused;
        }
      }

      &Orbite {
        top: 0;
        width: 1.6rem;
        height: 1.6rem;
        transform-origin: $spacer-L 50%;
      }

      &Star {
        transform: scale(0.5);
        transition: transform 250ms ease;
        background-color: var(--text_invert);

        :global(.dark) & {
          background-color: var(--text_1);
        }

        .isActive & {
          background-color: var(--colorType);
          transition-timing-function: $animate-bounce;
          transform: scale(1);
        }
      }

      @mixin coord React, 79rem, 19rem;
      @mixin coord Redux, 60rem, 10rem;
      @mixin coord Vue, 70rem, 23rem;
      @mixin coord Svelte, 4rem, 3rem;

      @mixin coord PostCSS, 65rem, -1rem;
      @mixin coord SCSS, 26rem, 17rem;
      @mixin coord CSS-in-JS, 24rem, 3rem;

      @mixin coord React Native, 63rem, 5rem;
      @mixin coord WebGL, 3rem, 22rem;
      @mixin coord NodeJS, 68rem, 13rem;
      @mixin coord ReasonML, 20rem, 10rem;

      @mixin coord Jest, 10rem, 12rem;
      @mixin coord Enzyme, -5rem, 7rem;
      @mixin coord Cypress, -1rem, 15rem;
      @mixin coord Testing Library, 75rem, 3rem;

      @mixin coord Git, 15rem, -1rem;
      @mixin coord Netlify, 56rem, 18rem;
      @mixin coord Parcel, 18rem, 22rem;

      @mixin ignore Webpack;
      @mixin ignore Gulp;
      @mixin ignore SEO;
      @mixin ignore Figma;
    }
  }

  @keyframes rotateOrbite {
    0% {
      transform: rotate(-45deg);
    }
    100% {
      transform: rotate(45deg);
    }
  }

  @keyframes rotateItself {
    0% {
      transform: rotate(0deg) scale(0.7);
    }
    50% {
      transform: rotate(90deg) scale(1);
    }
    100% {
      transform: rotate(180deg) scale(0.7);
    }
  }

  @keyframes blink {
    0% {
      opacity: 0.5;
    }
    2% {
      opacity: 0.2;
    }
    4% {
      opacity: 1;
    }
    6%,
    100% {
      opacity: 0.5;
    }
  }
</style>

<div class="main">
  <div class="tabList uAppear-0">
    {#each Object.keys(skills.lists) as id}
      <button
        class="tabBtn"
        class:isVisible={id !== '3' || hadClickInAll}
        tabIndex={id !== '3' || hadClickInAll ? '0' : '-1' }
        style="--colorType: {colorTypes[id]}"
        aria-expanded={lvlActive === id}
        on:click={() => updateSkill(id)}>
        {skills.lists[id]}
      </button>
    {/each}
  </div>
  <ul class="skills u-carousel uAppear-1">
    {#each sortByLevel as level, lvlIndex}
      <li class='skillsLvl u-carousel-item'
        data-level={skills.lists[lvlIndex]}
        style="--colorType: {colorTypes[lvlIndex]}"
        aria-hidden={lvlIndex != lvlActive}
      >
        <h3 class="f-title skillsTitle" id={`skill-${lvlIndex}`}>
          {skills.lists[lvlIndex]}
        </h3>
        <ul aria-labelledby={`skill-${lvlIndex}`}>
          {#each level as { name, list, url, hide }}
            <li
              class="point"
              class:isActive={list.includes(lvlActive)}
              data-tool={name}
              on:click={() => handlePointClick(list)}>
              <span class="pointOrbite">
                <span class="pointRotate">
                  <span class="pointStar" />
                </span>
              </span>
              {#if url && lvlIndex == lvlActive}
                <a rel="noreferrer" target="_blank" class="pointText u-link" href={url}>{name}</a>
              {:else}
                <span class="pointText">{name}</span>
              {/if}
            </li>
        {/each}
        </ul>
      </li>
    {/each}
  </ul>
</div>
