
uniform vec2 pixels;

varying vec2 vUv;
varying vec3 vColor;

float PI = 3.14159265359;

// Grid function
float grid(vec2 uv, float spacing, float lineWidth) {
    vec2 grid = abs(fract(uv / spacing - 0.5) - 0.5) / fwidth(uv / spacing);
    float line = min(grid.x, grid.y);
    return 1.0 - min(line, 1.0) * lineWidth;
}

void main() {
    // Calculate aspect ratio for uniform grid
    float aspect = pixels.x / pixels.y;
    vec2 gridUV = vUv;
    gridUV.x *= aspect;
    
    // Create multiple grid layers with different spacings for depth
    float grid1 = grid(gridUV * 20.0, 1.0, 0.15); // Main grid
    float grid2 = grid(gridUV * 5.0, 1.0, 0.25);  // Larger grid
    
    // Combine grids
    float gridPattern = max(grid1 * 0.3, grid2 * 0.15);
    
    // Add subtle fade from center
    vec2 center = vUv - 0.5;
    float dist = length(center);
    float fade = smoothstep(0.8, 0.2, dist);
    gridPattern *= fade;
    
    // Blend grid with the wave colors
    vec3 finalColor = vColor + vec3(gridPattern * 0.4);
    
    gl_FragColor = vec4(finalColor, 1.0);
}