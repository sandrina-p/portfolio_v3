<script>
  export let klass = '';
  export let type = '';

let displayText = ``;


</script>

<style lang="postcss">
.text {
  display: block;
}

.high {
  font-size: $font-L2;
  font-weight: 500;
  padding: 48px 0 24px;
}

</style>
<!-- Svelte not supporting custom Tags drives me nuts -->
<span class="text {klass} {type}">
	<slot></slot>
</span>
