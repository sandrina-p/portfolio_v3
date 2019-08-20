<script></script>

<style>
.container {
    position: relative;
    width: calc(100vw - (var(--spacer-L) * 2));
    max-width: 90rem;
    margin: 0 auto;
}
</style>

<div class="container {$$props.class}">
  <slot></slot>
</div>
