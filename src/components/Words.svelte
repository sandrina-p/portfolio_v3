<script>
  import words from '../data/words.js';
</script>

<style>
  .wrapper {
    max-width: 100rem;
    margin: 0 auto;
    padding: 0 var(--spacer-M);
    min-height: 100vh;
  }

  .heading {
    position: relative;
    font-size: var(--font-heading_2);
    line-height: 1.4;

    &Shadow {
      position: absolute;
      color: var(--primary_1);
      top: 0;
      left: 0;
      transform: translate(-1.5em, -0.5em);
      opacity: 0.3;
      z-index: -1;
    }
  }

  .group {
    display: flex;
    flex-wrap: wrap;
    margin-top: calc(var(--spacer-M) * 5);

    &Item {
      width: 50%;
      margin-bottom: var(--spacer-XL);

      &:nth-child(2n + 1) {
        padding-right: var(--spacer-XL);
      }

      &:nth-child(2n) {
        padding-left: var(--spacer-XL);
      }
    }
  }

  .title {
    font-size: var(--font-XL);
    line-height: 1.4;
  }

  .place {
    &Item {
      margin-top: var(--spacer-M);
      font-size: var(--font-L);
    }

    &Link {
      display: inline-flex;
      align-items: center;
      color: var(--text_0);
      text-decoration: none;
    }

    &Icon {
      width: 2rem;
      height: 2rem;
      fill: var(--text_1);
      margin-right: var(--spacer-S);
    }
  }

  .cta {
    background: var(--bg_0);
    color: var(--text_0);
    padding: var(--spacer-S) calc(var(--spacer-S) * 3);
    border: 1px solid var(--text_0);
    font-size: var(--font-L);
    cursor: pointer;
  }
</style>

<section class="wrapper">
  <h2 class="f-mono heading">
    <span class="headingShadow">When in the vibe</span>
    She enjoys to share ideas
  </h2>

  <div class="group">
    {#each words as { title, places }}
      <article class="groupItem">
        <h3 class="title">{title}</h3>
        <ul>
          {#each places as { svg, title, link }}
            <li class="placeItem">
              <a href={link} class="placeLink">
                <svg aria-hidden="true" class="placeIcon {svg}">
                  <use xlink:href="#{svg}" />
                </svg>
                {title}
              </a>
            </li>
          {/each}
        </ul>
      </article>
    {/each}
  </div>
  <button class="f-mono cta">Explore all of them</button>
</section>
