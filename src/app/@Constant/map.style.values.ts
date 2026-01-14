export const AREAS_PAINT_VALUES = {
  'fill-color': [
    'case',
    ['boolean', ['feature-state', 'hovered'], false],
    'rgba(209, 209, 209, 0.4)',
    'rgba(209, 209, 209, 0.2)',
  ],
} as any;

export const AREAS_OUTLINE_PAINT_VALUES = {
  'line-color': '#543821',
  'line-width': ['case', ['boolean', ['feature-state', 'hovered'], false], 4, 1.5],
} as any;

export const AREAS_LABEL_PAINT_VALUES = {
  'text-color': ['case', ['boolean', ['feature-state', 'hovered'], false], '#5151f5', '#e9e9f7'],
  'text-halo-color': 'black',
  'text-halo-width': 2,
  'text-halo-blur': 0.5,
} as any;

export const PLACES_LABEL_PAINT_VALUES = {
  'text-color': ['case', ['boolean', ['feature-state', 'hovered'], false], '#5151f5', '#e9e9f7'],
  'text-halo-color': 'black',
  'text-halo-width': 2,
  'text-halo-blur': 0.5,
} as any;

export const PATHS_PAINT_VALUES = {
  'line-color': ['case', ['boolean', ['feature-state', 'hovered'], false], '#4e72c7', '#4ec3c7'],
  'line-width': ['interpolate', ['linear'], ['zoom'], 4, 2, 16, 8],
} as any;

export const PATHS_PSEUDOLINE_PAINT_VALUES = {
  'line-color': 'rgba(20,240,30,0)',
  'line-width': ['interpolate', ['linear'], ['zoom'], 4, 14, 16, 10],
} as any;
