export function optimizePipe(pipe, threshold = 0.5, safetyFactor = 1.2) {
    const utilizationFactor = pipe.flowRate / pipe.pipeCapacity;

    if (utilizationFactor < threshold) {
        const newCapacity = pipe.flowRate * safetyFactor;
        return {
            ...pipe,
            pipeCapacity: newCapacity,  
            resized: true            
        };
    }

    return { ...pipe, resized: false };
}

