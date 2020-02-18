<script>
  import { onMount } from 'svelte';
  let isDark = false;
  let sunH = 4;

  onMount(() => {
    const isDefaultDark = document.body.classList.contains('dark'); // done at template.html
    setDark(isDefaultDark);
  });

  function setDark (isNowDark) {
    sunH = isNowDark ? 0 : 4;
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

  export let klass = '';
</script>

<style>
  .toggleTheme {
    position: relative;
    background: transparent;
    border: none;
    width: 4.4rem;
    height: 4.4rem;
    padding: 0;
    color: var(--text_1);
    cursor: pointer;

    &:hover {
      color: var(--primary_1);
    }

    &:focus {
      outline: none;
    }

    &[aria-pressed="true"] {
      .sunCenter {
        transform: scale(2.5);
      }
      .sunMoon {
        transform: scale(0.8);
      }
    }
  }

  .sun {
    width: 80%;
    height: 80%;
    margin: 0 auto;

    &Ray,
    &Center {
      fill: currentColor;
      transition: transform 200ms ease-out, color 200ms ease-out;
    }

    &Center,
    &Moon {
      transition: transform 200ms ease-out, fill 200ms ease-out;
      transform-origin: 50%;
    }

    &Moon {
      transform: scale(0);
    }

    &Ray {
      transition: height 150ms ease-out;
      opacity: 0.5;
    }
  }
</style>

<button class="toggleTheme {klass}"
  on:click={toggleTheme}
  aria-pressed={isDark}
  aria-label="Dark Theme">
  <svg class="sun u-svg" style="display:none;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <defs>
      <mask id="hole">
        <rect width="100%" height="100%" fill="white"/>
        <circle class="sunMoon" r="3" cx="13.5" cy="11" fill="black" />
      </mask>
    </defs>
    <circle class="sunCenter" r="3" cx="12" cy="12" mask="url(#hole)" />
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