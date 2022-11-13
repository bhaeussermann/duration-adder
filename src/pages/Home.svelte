<script lang="ts">
import { onMount } from 'svelte';
import DurationInput from '../components/DurationInput.svelte';
import { Duration } from '../common/duration';

let firstInput: DurationInput;

onMount(() => firstInput.focus());

let durations: Duration[] = [];
durations.push(Duration.Zero);

$: totalDuration = getTotalDuration(durations);

function getTotalDuration(durations: Duration[]): Duration {
  let totalMinutes = 0;
  for (let duration of durations) {
    totalMinutes += duration.hours * 60 + duration.minutes;
  }
  return new Duration(Math.floor(totalMinutes / 60), totalMinutes % 60);
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
<div class="duration-container">
  <DurationInput
    bind:this={firstInput}
    bind:duration={duration}
    on:changed={() => handleDurationChanged(index)}
    on:blur={() => handleDurationBlur(index)} />
</div>
{/each}

<div class="result-container">
  <div class="result-label">Total duration:</div>
  <div class="result-value">{totalDuration}</div>
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
</style>
