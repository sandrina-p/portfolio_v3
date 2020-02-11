<script>
  import { onMount } from 'svelte';
  let isDark = false;
  let sunH = 4;

  onMount(() => {
    const isDefaultDark = document.body.classList.contains('dark'); // done at template.html
    setDark(isDefaultDark);
  });

  function setDark (isNowDark) {
    sunH = isNowDark ? 3 : 4;
    isDark = isNowDark;
  }

  function toggleTheme() {
    const isNowDark = !isDark;
    setDark(isNowDark);

    // Don't use .toggle() to avoid possible desync when clicking toooo fast.
    const action = isNowDark ? 'add' : 'remove';
    // https://github.com/sveltejs/svelte/issues/3105
    document.body.classList[action]('dark');
  }

  export let klass;
</script>

<style>
  .toggleTheme {
    position: relative;
    background: transparent;
    border: none;
    width: 3rem;
    height: 3rem;
    padding: 0;
    color: var(--text_1);

    &:hover,
    &:focus {
      outline: none;
      color: var(--primary_1);
    }
  }

  .sun {
    width: 100%;
    height: 100%;

    &Ray,
    &Center {
      fill: currentColor;
    }

    &Ray {
      opacity: 0.5;
    }
  }
</style>

<button class="toggleTheme {klass}"
  on:click={toggleTheme}
  aria-pressed={isDark}
  aria-label="Dark Theme">
  <svg class="sun u-svg" style="display:none;" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <rect class="sunCenter" x="8.7" y="9.3" width="6" height="6" rx="3" />
    <rect class="sunRay" x="12.5" y="5.9" width="1.5" height={sunH} rx=".5" transform="rotate(-180 12.5 5.9)" />
    <rect class="sunRay" x="11" y="18.8" width="1.5" height={sunH} rx=".5" />
    <rect class="sunRay" x="18.2" y="13.1" width="1.5" height={sunH} rx=".5" transform="rotate(-90 18.2 13)" />
    <rect class="sunRay" x="5.2" y="11.6" width="1.5" height={sunH} rx=".5" transform="rotate(90 5.2 11.6)" />
    <rect class="sunRay" x="15.6" y="17.6" width="1.5" height={sunH} rx=".5" transform="rotate(-45 15.6 17.6)" />
    <rect class="sunRay" x="7.6" y="7.2" width="1.5" height={sunH} rx=".5" transform="rotate(135 7.6 7.2)" />
    <rect class="sunRay" x="16.8" y="8.3" width="1.5" height={sunH} rx=".5" transform="rotate(-135 16.8 8.3)" />
    <rect class="sunRay" x="6.6" y="16.3" width="1.5" height={sunH} rx=".5" transform="rotate(45 6.6 16.3)" />
  </svg>
</button>