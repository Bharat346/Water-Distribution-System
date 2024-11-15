// src/utils/pressureCheck.js
import calc_pipe_radius from '../utils/pipeRadius.js';

export function calc_pressure_diff(nodes, pipes, actualPressures, tolerance = 40000) {
  const density = 998.2; // kg/m³

  return pipes.map((pipe) => {
    const sourceNode = nodes.find((node) => node.id === pipe.source);
    const targetNode = nodes.find((node) => node.id === pipe.target);

    // If sourceNode or targetNode is not found, return default values for the pipe
    if (!sourceNode || !targetNode) {
      console.warn(`Source or target node not found for pipe:`, pipe);
      return {
        ...pipe,
        theoreticalPressureDiff: 0,
        actualPressureDiff: 0,
        leakageDetected: false,
      };
    }

    const sourceVelocity = sourceNode.velocity || 0;

    let rad = calc_pipe_radius(pipe.flowRate);
    let area = 3.14 * (rad ** 2);

    const targetVelocity = pipe.flowRate / area;

    // Apply Bernoulli’s equation: ΔP = 1/2 * ρ * (v² - u²)
    const theoreticalPressureDifference =
      0.5 * density * (Math.pow(targetVelocity, 2) - Math.pow(sourceVelocity, 2));

    // Check if actual pressures for both source and target nodes exist
    const actualSourcePressure = actualPressures[sourceNode.id];
    const actualTargetPressure = actualPressures[targetNode.id];

    // If actual pressures are not available, log a warning and return default values
    if (actualSourcePressure === undefined || actualTargetPressure === undefined) {
      console.warn(`Actual pressure data missing for nodes ${sourceNode.id} or ${targetNode.id}`);
      return {
        ...pipe,
        theoreticalPressureDiff: parseFloat(theoreticalPressureDifference.toFixed(2)),
        actualPressureDiff: 0,
        leakageDetected: false,
      };
    }

    // Calculate the actual pressure difference
    const actualPressureDifference = Math.abs(actualTargetPressure - actualSourcePressure);

    const isLeakageDetected =
      Math.abs(theoreticalPressureDifference - actualPressureDifference) > tolerance;

    return {
      ...pipe,
      theoreticalPressureDiff: parseFloat(theoreticalPressureDifference.toFixed(2)),
      actualPressureDiff: parseFloat(actualPressureDifference.toFixed(2)),
      leakageDetected: isLeakageDetected,
    };
  });
}
