<script lang="ts">
import Home from './pages/Home.svelte';
</script>

<main>
  <h1>Duration Adder</h1>
  <div>
    <Home />
  </div>
</main>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;

    > div {
      margin-left: auto;
      margin-right: auto;
    }
  }
</style>
