<script lang="ts">
import { onMount } from 'svelte';
import DurationInput from '../components/DurationInput.svelte';
import type { Duration } from '../common/duration';

let firstInput: DurationInput;

onMount(() => firstInput.focus());

let durations: Duration[] = [];
durations.push({ hours: 0, minutes: 0 });

function handleDurationChanged(index: number) {
  const isLast = index === durations.length - 1;
  if (isLast) {
    const lastDuration = durations[index];
    if (!!(lastDuration.hours + lastDuration.minutes)) {
      durations.push({ hours: 0, minutes: 0 });
    }
  }
}

function handleDurationBlur(index: number) {
  const isLast = index === durations.length - 1;
  if (!isLast) {
    const blurredDuration = durations[index];
    if (!(blurredDuration.hours + blurredDuration.minutes)) {
      durations = durations.filter((_, i) => i !== index);
    }
  }
}
</script>

{#each durations as duration, index}
<div>
  <DurationInput
    bind:this={firstInput}
    bind:duration={duration}
    on:changed={() => handleDurationChanged(index)}
    on:blur={() => handleDurationBlur(index)} />
</div>
{/each}
