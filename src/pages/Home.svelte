<script lang="ts">
import DurationInput from '../components/DurationInput.svelte';
import { Duration } from '../common/duration';

let durations: Duration[];
clearDurations();

$: totalDuration = getTotalDuration(durations);

function clearDurations() {
  durations = [];
  setTimeout(() => {
    durations.push(Duration.Zero);
    durations = durations;
  });
}

function getTotalDuration(durations: Duration[]): Duration {
  let totalMinutes = 0;
  for (let duration of durations) {
    totalMinutes += duration.hours * 60 + duration.minutes;
  }
  return new Duration(Math.floor(totalMinutes / 60), totalMinutes % 60);
}

function handleDurationInputAdded(containerElement: HTMLElement) {
  if (durations.length === 1) {
    (containerElement.firstChild as unknown as DurationInput).focus();
  }
}

function handleDurationChanged(index: number) {
  const isLast = index === durations.length - 1;
  if (isLast) {
    const lastDuration = durations[index];
    if (!lastDuration.isZero) {
      durations.push(Duration.Zero);
    }
  }
}

function handleDurationBlur(index: number) {
  const isLast = index === durations.length - 1;
  if (!isLast) {
    const blurredDuration = durations[index];
    if (blurredDuration.isZero) {
      durations = durations.filter((_, i) => i !== index);
    }
  }
}
</script>

{#each durations as duration, index}
<div class="duration-container" use:handleDurationInputAdded>
  <DurationInput
    bind:duration={duration}
    on:changed={() => handleDurationChanged(index)}
    on:blur={() => handleDurationBlur(index)} />
</div>
{/each}

<div class="result-container">
  <div class="result-label">Total duration:</div>
  <div class="result-value">{totalDuration}</div>
</div>

<div class="buttons-container">
  {#if durations.length > 1}
  <!-- svelte-ignore a11y-invalid-attribute -->
  <a
    href="javascript: void(0)"
    on:click={clearDurations}
    on:keypress={event => { if (event.code === 'Space') clearDurations(); }}>Clear</a>
  {/if}
</div>

<style lang="scss">
  .duration-container {
    margin: 15px;
  }

  .result-container {
    display: flex;
    flex-direction: column;

    > div {
      margin-left: auto;
      margin-right: auto;
      
      &.result-label {
        font-size: 1.2em;
      }

      &.result-value {
        font-size: 1.5em;
        font-weight: bold;
      }
    }
  }

  .buttons-container {
    display: flex;

    > * {
      margin-left: auto;
      margin-right: auto;
    }
  }
</style>
