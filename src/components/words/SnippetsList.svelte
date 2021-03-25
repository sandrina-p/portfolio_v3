<script>
  import { sendGA } from '../../utils';

  export let list;
</script>

<style lang="postcss">

.cardItem {
  border-bottom: 3px solid var(--primary_1_smooth);
  padding: $spacer-S 0;
  margin: $spacer-S 0;
}

.u-link {
  text-decoration: none;
}

.short {
  color: var(--text_1);
}

</style>

<ul class="cardList">
  {#each list as { title, short, link, id }, index}
    <li
      class="cardItem">
      <h3 class="f-title title">
        <a href={link} rel="noreferrer" target="_blank"
          class="u-link"
          on:click={() => sendGA('send', 'event', 'click' , 'words', id)}>
          {title}
        </a>
      </h3>
      <p class="short">{short}</p>
    </li>
  {/each}
</ul>