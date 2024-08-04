/** Maximum possible z-index */
export const zIndexMax = 2147483647;

export const addCustomProperty = (definition: PropertyDefinition, throwOnError = false) => {
  try {
    window.CSS.registerProperty(definition);
  } catch (error) {
    (throwOnError ? console.error : console.warn)(`Failed to register custom CSS property: ${definition.name}`, definition, error);
    if (throwOnError) throw error;
  }
};

export const zIndex = {
  behind: -1,
  default: 0,
  inFront: 1,
  layer1: 10,
  layer2: 100,
  layer3: 200,
  layer4: 300,
  layer5: 400,
  layerUI: 1000,
  layerMax: zIndexMax,
};
