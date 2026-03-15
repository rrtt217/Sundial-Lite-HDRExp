//     _________      __        __     ___       __     __________      ________        ______        __           
//    /  _____  \    |  |      |  |   |   \     |  |   |   _____  \    |__    __|      /  __  \      |  |          
//   /  /     \__\   |  |      |  |   |    \    |  |   |  |     \  \      |  |        /  /  \  \     |  |          
//  |  |             |  |      |  |   |  |  \   |  |   |  |      |  |     |  |       /  /    \  \    |  |          
//   \  \______      |  |      |  |   |  |\  \  |  |   |  |      |  |     |  |      |  |______|  |   |  |          
//    \______  \     |  |      |  |   |  | \  \ |  |   |  |      |  |     |  |      |   ______   |   |  |          
//           \  \    |  |      |  |   |  |  \  \|  |   |  |      |  |     |  |      |  |      |  |   |  |          
//  ___       |  |   |  |      |  |   |  |   \  |  |   |  |      |  |     |  |      |  |      |  |   |  |          
//  \  \_____/  /     \  \____/  /    |  |    \    |   |  |_____/  /    __|  |__    |  |      |  |   |  |_________ 
//   \_________/       \________/     |__|     \___|   |__________/    |________|   |__|      |__|   |____________|
//
//  General Public License v3.0. Copyright (C) 2026 GeForceLegend.
//  https://github.com/GeForceLegend/Sundial-Lite
//  https://www.gnu.org/licenses/gpl-3.0.en.html
//
//  Post processing
//

layout(location = 0) out vec4 texBuffer0;

in vec2 texcoord;

#define RAIN_BLOOM_FOG_DENSITY 0.2 // [0.0 0.01 0.02 0.03 0.04 0.06 0.08 0.1 0.12 0.14 0.16 0.18 0.2 0.22 0.24 0.26 0.28 0.3 0.35 0.4 0.45 0.5 0.6 0.7 0.8 0.9 1.0 1.1 1.2 1.3 1.4 1.5 1.6 1.7 1.8 1.9 2.0 2.2 2.4 2.6 2.8 3.0 3.2 3.4 3.6 3.8 4.0 4.2 4.4 4.6 4.8 5.0 5.5 6.0 6.5 7.0 7.5 8.0 9.5 10.0 11.0 12.0 13.0 14.0 15.0 16.0 17.0 18.0 19.0 20.0 22.0 24.0 26.0 28.0 30.0 32.0 34.0 36.0 38.0 40.0 42.0 44.0 46.0 48.0 50.0 55.0 60.0 65.0 70.0 75.0 80.0 85.0 90.0 95.0 100.0]

#define BLOOM_INTENSITY 0.8 // [0.0 0.1 0.2 0.3 0.4 0.5 0.6 0.7 0.8 0.9 1.0 1.1 1.2 1.3 1.4 1.5 1.6 1.7 1.8 1.9 2.0 2.2 2.4 2.6 2.8 3.0 3.2 3.4 3.6 3.8 4.0 4.2 4.4 4.6 4.8 5.0 5.5 6.0 6.5 7.0 7.5 8.0 9.5 10.0]
#define DISTORTION_STRENGTH 0.0 // [-1.0 -0.95 -0.9 -0.85 -0.8 -0.75 -0.7 -0.65 -0.6 -0.55 -0.5 -0.45 -0.4 -0.35 -0.3 -0.25 -0.2 -0.15 -0.1 -0.05 0.0 0.05 0.1 0.15 0.2 0.25 0.3 0.35 0.4 0.45 0.5 0.55 0.6 0.65 0.7 0.75 0.8 0.85 0.9 0.95 1.0]
// Vignette
    #define VIGNETTE_STRENGTH 1.0 // [0.0 0.1 0.2 0.3 0.4 0.5 0.6 0.7 0.8 0.9 1.0 1.1 1.2 1.3 1.4 1.5 1.6 1.7 1.8 1.9 2.0 2.2 2.4 2.6 2.8 3.0 3.2 3.4 3.6 3.8 4.0 4.2 4.4 4.6 4.8 5.0 5.5 6.0 6.5 7.0 7.5 8.0 9.5 10.0 11.0 12.0 13.0 14.0 15.0 16.0 17.0 18.0 19.0 20.0]
// Tonemap
    #define TONEMAPPING AgX_Allenwp // [uchimura AgX_Allenwp ACES AgX]
    #define GAMMA 1.0 // [0.0 0.1 0.2 0.3 0.4 0.5 0.6 0.7 0.8 0.9 1.0 1.1 1.2 1.3 1.4 1.5 1.6 1.7 1.8 1.9 2.0 2.2 2.4 2.6 2.8 3.0 3.2 3.4 3.6 3.8 4.0 4.2 4.4 4.6 4.8 5.0 5.5 6.0 6.5 7.0 7.5 8.0 9.5 10.0]
    #define SATURATION 1.0 // [0.0 0.1 0.2 0.3 0.4 0.5 0.6 0.7 0.8 0.9 1.0 1.1 1.2 1.3 1.4 1.5 1.6 1.7 1.8 1.9 2.0]
    #define COLOR_TEMPERATURE 6500.0 // [1000.0 1200.0 1400.0 1600.0 1800.0 2000.0 2200.0 2400.0 2600.0 2800.0 3000.0 3200.0 3400.0 3600.0 3800.0 4000.0 4250.0 4500.0 4750.0 5000.0 5250.0 5500.0 5750.0 6000.0 6250.0 6500.0 6750.0 7000.0 7250.0 7500.0 7750.0 8000.0 8500.0 9000.0 9500.0 10000.0 10500.0 11000.0 11500.0 12000.0 13000.0 14000.0 15000.0 16000.0 18000.0 20000.0 22000.0 24000.0 28000.0 32000.0 36000.0 40000.0]
    // Uchimura settings
        #define CONTRAST 1.0 // [0.0 0.1 0.2 0.3 0.4 0.5 0.6 0.7 0.8 0.9 1.0 1.1 1.2 1.3 1.4 1.5 1.6 1.7 1.8 1.9 2.0]
        #define MINIMUM_BRIGHTNESS 0.00 // [0.00 0.01 0.02 0.03 0.04 0.05 0.06 0.07 0.08 0.09 0.10]
        #define BLACK_TIGHTNESS 1.0 // [0.1 0.2 0.3 0.4 0.5 0.6 0.7 0.8 0.9 1.0 1.1 1.2 1.3 1.4 1.5 1.6 1.7 1.8 1.9 2.0]
    // AgX settings
        #define AGX_LOOK 3 // [0 1 2 3]
        #define AGX_EV_MIN -7.5 // [-15.0 -14.5 -14.0 -13.5 -13.0 -12.5 -12.0 -11.5 -11.0 -10.5 -10.0 -9.5 -9.0 -8.5 -8.0 -7.5 -7.0 -6.5 -6.0 -5.5 -5.0 -4.5 -4.0 -3.5 -3.0 -2.5 -2.0 -1.5 -1.0 -0.5 0.0 0.5 1.0 1.5 2.0 2.5 3.0 3.5 4.0 4.5 5.0 5.5 6.0 6.5 7.0 7.5 8.0 8.5 9.0 9.5 10]
        #define AGX_EV_MAX 5.0 // [-15.0 -14.5 -14.0 -13.5 -13.0 -12.5 -12.0 -11.5 -11.0 -10.5 -10.0 -9.5 -9.0 -8.5 -8.0 -7.5 -7.0 -6.5 -6.0 -5.5 -5.0 -4.5 -4.0 -3.5 -3.0 -2.5 -2.0 -1.5 -1.0 -0.5 0.0 0.5 1.0 1.5 2.0 2.5 3.0 3.5 4.0 4.5 5.0 5.5 6.0 6.5 7.0 7.5 8.0 8.5 9.0 9.5 10]
// Exposure
    #define EXPOSURE_VALUE -0.3 // [-10.0 -9.8 -9.6 -9.4 -9.2 -9.0 -8.8 -8.6 -8.4 -8.2 -8.0 -7.8 -7.6 -7.4 -7.2 -7.0 -6.8 -6.6 -6.4 -6.2 -6.0 -5.8 -5.6 -5.4 -5.2 -5.0 -4.8 -4.6 -4.4 -4.2 -4.0 -3.8 -3.6 -3.4 -3.2 -3.0 -2.8 -2.6 -2.4 -2.2 -2.0 -1.8 -1.6 -1.4 -1.2 -1.0 -0.8 -0.6 -0.4 -0.3 -0.2 0.0 0.2 0.4 0.6 0.8 1.0 1.2 1.4 1.6 1.8 2.0 2.2 2.4 2.6 2.8 3.0 3.2 3.4 3.6 3.8 4.0 4.2 4.4 4.6 4.8 5.0 5.2 5.4 5.6 5.8 6.0 6.2 6.4 6.6 6.8 7.0 7.2 7.4 7.6 7.8 8.0 8.2 8.4 8.6 8.8 9.0 9.2 9.4 9.6 9.8 10.0]
    #define AVERAGE_EXPOSURE_STRENGTH 0.56 // [0.00 0.01 0.02 0.03 0.04 0.05 0.06 0.07 0.08 0.09 0.10 0.12 0.14 0.16 0.18 0.20 0.24 0.28 0.32 0.36 0.40 0.44 0.48 0.52 0.56 0.60 0.65 0.70 0.75 0.80 0.85 0.90 0.95 1.00]

#include "/settings/GlobalSettings.glsl"
#include "/libs/Uniform.glsl"
#include "/libs/Common.glsl"
#include "/libs/GbufferData.glsl"

vec2 bloomMipEdge(float level) {
    float expLevel = exp2(-level);
    return screenSize * (1.0 - expLevel);
}

vec3 sampleBloom(vec2 coord, float level, vec2 minRange, vec2 maxRange) {
    float expLevel = exp2(-level);
    float basicOffset = 1.0 - 2.0 * expLevel;
    vec2 centerCoord = coord * expLevel + vec2(basicOffset);

    vec2 maxTexel = (maxRange + 0.5) * texelSize;
    vec2 minTexel = (minRange + 0.5) * texelSize;

    centerCoord = clamp(centerCoord, minTexel, maxTexel);

    vec3 bloomColor = textureLod(colortex4, centerCoord, 0.0).rgb;
    return bloomColor;
}

vec3 calculateBloom(vec2 coord) {
    vec3 totalBloom = vec3(0.0);
    vec2 maxRange = bloomMipEdge(1.0);
    vec2 ceilMinRange = vec2(0.0);
    vec2 floorMaxRange = floor(maxRange);
    totalBloom += sampleBloom(coord, 1.0, ceilMinRange, floorMaxRange) * 0.92;
    ceilMinRange = floorMaxRange + clamp((maxRange - floorMaxRange) * 1e+20, 0.0, 1.0);
    maxRange = bloomMipEdge(2.0);
    floorMaxRange = floor(maxRange);
    totalBloom += sampleBloom(coord, 2.0, ceilMinRange, floorMaxRange) * 0.8464;
    ceilMinRange = floorMaxRange + clamp((maxRange - floorMaxRange) * 1e+20, 0.0, 1.0);
    maxRange = bloomMipEdge(3.0);
    floorMaxRange = floor(maxRange);
    totalBloom += sampleBloom(coord, 3.0, ceilMinRange, floorMaxRange) * 0.778688;
    ceilMinRange = floorMaxRange + clamp((maxRange - floorMaxRange) * 1e+20, 0.0, 1.0);
    maxRange = bloomMipEdge(4.0);
    floorMaxRange = floor(maxRange);
    totalBloom += sampleBloom(coord, 4.0, ceilMinRange, floorMaxRange) * 0.716393;
    ceilMinRange = floorMaxRange + clamp((maxRange - floorMaxRange) * 1e+20, 0.0, 1.0);
    maxRange = bloomMipEdge(5.0);
    floorMaxRange = floor(maxRange);
    totalBloom += sampleBloom(coord, 5.0, ceilMinRange, floorMaxRange) * 0.659081;
    ceilMinRange = floorMaxRange + clamp((maxRange - floorMaxRange) * 1e+20, 0.0, 1.0);
    maxRange = bloomMipEdge(6.0);
    floorMaxRange = floor(maxRange);
    totalBloom += sampleBloom(coord, 6.0, ceilMinRange, floorMaxRange) * 0.606355;
    ceilMinRange = floorMaxRange + clamp((maxRange - floorMaxRange) * 1e+20, 0.0, 1.0);
    maxRange = bloomMipEdge(7.0);
    floorMaxRange = floor(maxRange);
    totalBloom += sampleBloom(coord, 7.0, ceilMinRange, floorMaxRange) * 0.557847;
    return pow(totalBloom * (1.0 / 5.084764), vec3(2.2));
}

// Uchimura 2017, "HDR theory and practice"
// Math: https://www.desmos.com/calculator/gslcdxvipg
// Source: https://www.slideshare.net/nikuque/hdr-theory-and-practicce-jp
vec3 uchimura(vec3 x, float P, float a, float m, float l, float c, float b) {
    float l0 = ((P - m) * l) / a;
    float L0 = m - m / a;
    float L1 = m + (1.0 - m) / a;
    float S0 = m + l0;
    float S1 = m + a * l0;
    float C2 = (a * P) / (P - S1);
    float CP = -1.44269502 * C2 / P;
    vec3 w0 = vec3(1.0 - smoothstep(0.0, m, x));
    vec3 w2 = vec3(step(S0, x));
    vec3 w1 = vec3(1.0 - w0 - w2);
    vec3 T = vec3(pow(x, vec3(c)) / pow(m, c - 1.0) + b);
    vec3 S = vec3(P - (P - S1) / exp2(CP * S0) * exp2(CP * x));
    vec3 L = vec3(m + a * (x - m));
    return T * w0 + L * w1 + S * w2;
}

vec3 uchimura(vec3 x) {
    #ifdef HDR_ENABLED
        float P = HdrGamePeakBrightness / HdrGamePaperWhiteBrightness;  // max display brightness
    #else
        const float P = 1.0;  // max display brightness
    #endif
    const float a = CONTRAST;  // contrast
    const float m = 0.22; // linear section start
    const float l = 0.4;  // linear section length
    const float c = 1.33 * BLACK_TIGHTNESS;    // black tightness
    const float b = MINIMUM_BRIGHTNESS; // pedestal

    vec3 color = uchimura(x, P, a, m, l, c, b);

    #ifdef HDR_ENABLED
        return color;
    #else
        return pow(color, vec3(1.0 / (2.2 * GAMMA)));
    #endif
}

// Shared from https://www.shadertoy.com/view/lsSXW1 by CC BY 3.0
vec3 colorTemperature() {
    const float temperature = float(COLOR_TEMPERATURE) / 100.0;
    vec3 color;
    if (COLOR_TEMPERATURE <= 6600.0) {
        color = vec3(
            1.0,
            pow(clamp(0.39008157876901960784 * log(temperature) - 0.63184144378862745098, 0.0, 1.0), 2.2),
            pow(clamp(0.54320678911019607843 * log(temperature - 10.0) - 1.19625408914, 0.0, 1.0), 2.2)
        );
    } else {
        const float t = temperature - 60.0;
        color = vec3(
            pow(clamp(1.29293618606274509804 * pow(t, -0.1332047592), 0.0, 1.0), 2.2),
            pow(clamp(1.12989086089529411765 * pow(t, -0.0755148492), 0.0, 1.0), 2.2),
            1.0
        );
    }
    return color;
}

// AgX from https://www.shadertoy.com/view/cd3XWr
vec3 agxDefaultContrastApprox(vec3 x) {
    return (((((15.5 * x - 40.14) * x + 31.96) * x - 6.868) * x + 0.4298) * x + 0.1191) * x  - 0.00232;
}

vec3 AgX(vec3 val) {
    const mat3 agx_mat = mat3(
        0.842479062253094, 0.0423282422610123, 0.0423756549057051,
        0.0784335999999992,  0.878468636469772,  0.0784336,
        0.0792237451477643, 0.0791661274605434, 0.879142973793104);

    const float min_ev = AGX_EV_MIN;
    const float max_ev = AGX_EV_MAX;

    // Input transform
    val = agx_mat * (val * 7.0);

    // Log2 space encoding
    val = clamp(log2(val) / (max_ev - min_ev) - min_ev / (max_ev - min_ev), 0.0, 1.0);

    // Apply sigmoid function approximation
    val = agxDefaultContrastApprox(val);

    const vec3 lw = vec3(0.2126, 0.7152, 0.0722);
    float luma = dot(val, lw);

    // Default
    vec3 offset = vec3(0.0);
    vec3 slope = vec3(1.0);
    vec3 power = vec3(1.0);
    float sat = 1.0;

    #if AGX_LOOK == 1
        // Golden
        slope = vec3(1.0, 0.9, 0.5);
        power = vec3(0.8);
        sat = 0.8;
    #elif AGX_LOOK == 2
        // Punchy
        slope = vec3(1.0);
        power = vec3(1.35, 1.35, 1.35);
        sat = 1.4;
    #elif AGX_LOOK == 3
        // Pure
        offset = vec3(OFFSET_R, OFFSET_G, OFFSET_B);
        slope = vec3(SLOPE_R, SLOPE_G, SLOPE_B);
        power = vec3(2.0 - POWER_R, 2.0 - POWER_G, 2.0 - POWER_B);
        sat = SAT_1;
    #endif

    // ASC CDL
    val = pow(val * slope + offset, power);
    val = luma + sat * (val - luma);

    const mat3 agx_mat_inv = mat3(
        1.19687900512017, -0.0528968517574562, -0.0529716355144438,
        -0.0980208811401368, 1.15190312990417, -0.0980434501171241,
        -0.0990297440797205, -0.0989611768448433, 1.15107367264116
    );

    // Undo input transform
    val = agx_mat_inv * val;
    val = pow(val, vec3(1.0 / GAMMA));

    return val;
}

vec3 RRTAndODTFit(vec3 v) {
    vec3 a = v * (v + 0.0245786) - 0.000090537;
    vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081;
    return a / b;
}

vec3 ACES(vec3 color) {
	color *= 1.7;
	
    color *= mat3(0.59719, 0.35458, 0.04823, 0.07600, 0.90834, 0.01566, 0.02840, 0.13383, 0.83777);
    color = RRTAndODTFit(color);
    color *= mat3(1.60475, -0.53108, -0.07367, -0.10208, 1.10813, -0.00605, -0.00327, -0.07276, 1.07602);
	
	color = pow(color, vec3(1.0 / (2.2 * GAMMA)));
    return color;
}

// allenwp tonemapping curve; developed for use in the Godot game engine.
// Source and details: https://allenwp.com/blog/2025/05/29/allenwp-tonemapping-curve/
// Input must be a non-negative linear scene value.
vec3 allenwp_curve(vec3 x) {
    #ifdef HDR_ENABLED
        float output_max_value = HdrGamePeakBrightness / HdrGamePaperWhiteBrightness;
    #else
        float output_max_value = 1.0;
    #endif
	// These constants must match the those in the C++ code that calculates the parameters.
	// 18% "middle gray" is perceptually 50% of the brightness of reference white.
	const float awp_crossover_point = 0.1841865;
	float awp_shoulder_max = output_max_value - awp_crossover_point;
    float awp_high_clip = 12.0;
    awp_high_clip = max(awp_high_clip, output_max_value);
	float awp_contrast = 1.5;
	float awp_toe_a = ((1.0 / awp_crossover_point) - 1.0) * pow(awp_crossover_point, awp_contrast);
    float awp_slope_denom = pow(awp_crossover_point, awp_contrast) + awp_toe_a;
	float awp_slope = (awp_contrast * pow(awp_crossover_point, awp_contrast - 1.0) * awp_toe_a) / (awp_slope_denom * awp_slope_denom);
	float awp_w = awp_high_clip - awp_crossover_point;
	awp_w = awp_w * awp_w;
	awp_w = awp_w / awp_shoulder_max;
	awp_w = awp_w * awp_slope;

	// Reinhard-like shoulder:
	vec3 s = x - awp_crossover_point;
	vec3 slope_s = awp_slope * s;
	s = slope_s * (1.0 + s / awp_w) / (1.0 + (slope_s / awp_shoulder_max));
	s += awp_crossover_point;

	// Sigmoid power function toe:
	vec3 t = pow(x, vec3(awp_contrast));
	t = t / (t + awp_toe_a);

	return mix(s, t, lessThan(x, vec3(awp_crossover_point)));
}

// This is an approximation and simplification of EaryChow's AgX implementation that is used by Blender.
// This code is based off of the script that generates the AgX_Base_sRGB.cube LUT that Blender uses.
// Source: https://github.com/EaryChow/AgX_LUT_Gen/blob/main/AgXBasesRGB.py
// Colorspace transformation source: https://www.colour-science.org:8010/apps/rgb_colourspace_transformation_matrix
vec3 AgX_Allenwp(vec3 color) {
	// Input color should be non-negative!
	// Large negative values in one channel and large positive values in other
	// channels can result in a colour that appears darker and more saturated than
	// desired after passing it through the inset matrix. For this reason, it is
	// best to prevent negative input values.
	// This is done before the Rec. 2020 transform to allow the Rec. 2020
	// transform to be combined with the AgX inset matrix. This results in a loss
	// of color information that could be correctly interpreted within the
	// Rec. 2020 color space as positive RGB values, but is often not worth
	// the performance cost of an additional matrix multiplication.
	//
	// Additionally, this AgX configuration was created subjectively based on
	// output appearance in the Rec. 709 color gamut, so it is possible that these
	// matrices will not perform well with non-Rec. 709 output (more testing with
	// future wide-gamut displays is be needed).
	// See this comment from the author on the decisions made to create the matrices:
	// https://github.com/godotengine/godot-proposals/issues/12317#issuecomment-2835824250

	// Combined Rec. 709 to Rec. 2020 and Blender AgX inset matrices:
	const mat3 rec709_to_rec2020_agx_inset_matrix = mat3(
			0.544814746488245, 0.140416948464053, 0.0888104196149096,
			0.373787398372697, 0.754137554567394, 0.178871756420858,
			0.0813978551390581, 0.105445496968552, 0.732317823964232);

	// Combined inverse AgX outset matrix and Rec. 2020 to Rec. 709 matrices.
	const mat3 agx_outset_rec2020_to_rec709_matrix = mat3(
			1.96488741169489, -0.299313364904742, -0.164352742528393,
			-0.855988495690215, 1.32639796461980, -0.238183969428088,
			-0.108898916004672, -0.0270845997150571, 1.40253671195648);
    #ifdef HDR_ENABLED
	    float output_max_value = HdrGamePeakBrightness / HdrGamePaperWhiteBrightness;
    #else
        float output_max_value = 1.0;
    #endif

    // Apply inset matrix.
	color = rec709_to_rec2020_agx_inset_matrix * color;

	// Use the allenwp tonemapping curve to match the Blender AgX curve while
	// providing stability across all variable dyanimc range (SDR, HDR, EDR).
	color = allenwp_curve(color);

	// Clipping to output_max_value is required to address a cyan colour that occurs
	// with very bright inputs.
	color = min(vec3(output_max_value), color);

	// Apply outset to make the result more chroma-laden and then go back to Rec. 709.
	color = agx_outset_rec2020_to_rec709_matrix * color;

	// Blender's lusRGB.compensate_low_side is too complex for this shader, so
	// simply return the color, even if it has negative components. These negative
	// components may be useful for subsequent color adjustments.
    return color;
}

void main() {
    vec2 sampleCoord = texcoord;

    if (DISTORTION_STRENGTH != 0.0) {
        vec2 offset = texcoord - vec2(0.5);
        float r = dot(offset, offset);
        float r2 = 1.0 + DISTORTION_STRENGTH * r;

        vec2 disortion_offset = r2 * vec2(offset);
        const float disortion_scale = 1.0 / max(1.0 + DISTORTION_STRENGTH * 0.25, 1.0 + DISTORTION_STRENGTH * 0.5);
        sampleCoord = vec2(0.5) + disortion_offset * disortion_scale;
    }

    vec3 finalColor = textureLod(colortex3, sampleCoord, 0.0).rgb;

    vec3 bloomColor = calculateBloom(sampleCoord);
    float screenDepth = textureLod(depthtex0, sampleCoord, 0.0).x;
    float viewDepth;
    #ifdef LOD
        if (screenDepth == 1.0) {
            screenDepth = getLodDepthWater(sampleCoord);
            viewDepth = screenToViewDepthLod(screenDepth);
        } else
    #endif
    {
        viewDepth = screenToViewDepth(screenDepth);
    }
    #ifdef SHADOW_AND_SKY
        finalColor = mix(bloomColor, finalColor, exp2(-weatherStrength * weatherStrength * (eyeBrightnessSmooth.y / 240.0) * RAIN_BLOOM_FOG_DENSITY * 0.03 * viewDepth));
    #endif
    float weatherData = textureLod(colortex0, sampleCoord, 0.0).w * 2.5 - 1.5;
    float bloomAmount = 0.2 * BLOOM_INTENSITY + 1.0 * step(weatherData, -0.3) + 0.6 * step(0.5, float(isEyeInWater)) + step(1.5, float(isEyeInWater));
    finalColor = (finalColor + bloomColor * bloomAmount) / (1.0 + bloomAmount * 0.5);

    vec2 dist = (texcoord - 0.5);
    float averageBrightness = textureLod(colortex7, vec2(0.0), 0.0).w;
    finalColor *= exp2(
        -2.0 * 1.44269502 * dot(dist, dist) * VIGNETTE_STRENGTH +       // Vignette
        log2(averageBrightness + 1e-5) * -AVERAGE_EXPOSURE_STRENGTH     // Average exposure
    ) * 0.2;

    finalColor *= exp2(EXPOSURE_VALUE);

    float luminance = luminanceLiner(finalColor);
    finalColor = max(vec3(0.0), mix(finalColor, vec3(luminance), vec3(1.0 - SATURATION)));

    finalColor = colorTemperature() * finalColor;

    finalColor = TONEMAPPING(finalColor);

    #ifndef HDR_ENABLED
    finalColor += (blueNoiseTemporal(texcoord.st) - 0.5) * (2.0 / 255.0);

    texBuffer0 = vec4(clamp(finalColor, vec3(0.0), vec3(1.0)), 1.0);
    #else
    // Unclamp for HDR
    texBuffer0 = vec4(finalColor, 1.0);
    #endif
}

/* DRAWBUFFERS:0 */
