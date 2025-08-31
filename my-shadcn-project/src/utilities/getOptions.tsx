// utils/formOptionsProcessor.ts

export interface FormOption {
  id: number | string;
  label: string;
  searchValue?: string;
  originalData?: any; // Store original data for additional access
}

export interface ProcessOptionsConfig {
  data: any[];
  idField: string;
  labelFields: string[];
  searchFields?: string[];
  fallbackField?: string;
  separator?: string; // Custom separator for label fields (default: ' ')
}

/**
 * Generic function to process raw data into standardized form options
 * 
 * @param config - Configuration object for processing
 * @returns Array of FormOption objects
 * 
 * @example
 * // Basic usage
 * const options = processDataToFormOptions({
 *   data: users,
 *   idField: 'id',
 *   labelFields: ['first_name', 'last_name'],
 *   searchFields: ['email'],
 *   fallbackField: 'email'
 * });
 * 
 * // Advanced usage with custom separator
 * const options = processDataToFormOptions({
 *   data: products,
 *   idField: 'sku',
 *   labelFields: ['brand', 'model'],
 *   separator: ' - ',
 *   searchFields: ['category', 'description'],
 *   fallbackField: 'sku'
 * });
 */
export const processDataToFormOptions = (config: ProcessOptionsConfig): FormOption[] => {
  const { 
    data, 
    idField, 
    labelFields, 
    searchFields = [], 
    fallbackField,
    separator = ' '
  } = config;
  
  if (!Array.isArray(data)) {
    console.warn('processDataToFormOptions: data must be an array');
    return [];
  }

  console.log('Processing form options with config:', config);
  
  return data.map((item: any, index: number) => {
    try {
      // Extract and filter label parts
      const labelParts = labelFields
        .map(field => {
          const value = getNestedValue(item, field);
          return value;
        })
        .filter((value): value is string => 
          typeof value === 'string' && value.trim() !== ''
        );
      
      // Create the main label
      let label = labelParts.join(separator).trim();
      
      // Use fallback if label is empty
      if (!label && fallbackField) {
        const fallbackValue = getNestedValue(item, fallbackField);
        if (fallbackValue) {
          if (fallbackField.toLowerCase().includes('email') && typeof fallbackValue === 'string') {
            label = fallbackValue.split('@')[0];
          } else {
            label = String(fallbackValue);
          }
        }
      }
      
      // Final fallback using ID
      if (!label) {
        const idValue = getNestedValue(item, idField);
        label = `Item ${idValue || index}`;
      }
      
      // Create search value (combines label + search fields)
      const searchParts = [label];
      searchFields.forEach(field => {
        const value = getNestedValue(item, field);
        if (value && typeof value === 'string') {
          searchParts.push(value);
        }
      });
      const searchValue = searchParts.join(' ').toLowerCase();
      
      return {
        id: getNestedValue(item, idField),
        label: label,
        searchValue: searchValue,
        originalData: item
      };
    } catch (error) {
      console.error('Error processing item at index', index, ':', error, item);
      return {
        id: index,
        label: `Error processing item ${index}`,
        searchValue: `error ${index}`,
        originalData: item
      };
    }
  });
};

/**
 * Helper function to get nested values from an object using dot notation
 * @param obj - Object to get value from
 * @param path - Path to the value (e.g., 'user.profile.name')
 * @returns The value at the specified path
 */
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
};

/**
 * Predefined configurations for common use cases
 */
export const commonConfigs = {
  // Standard user configuration
  user: {
    idField: 'id',
    labelFields: ['first_name', 'middle_name', 'last_name'],
    searchFields: ['email', 'username'],
    fallbackField: 'email'
  },
  
  // Simple name configuration
  simpleName: {
    idField: 'id',
    labelFields: ['name'],
    searchFields: ['code', 'description']
  },
  
  // Product configuration
  product: {
    idField: 'id',
    labelFields: ['name'],
    searchFields: ['sku', 'category', 'brand'],
    fallbackField: 'sku'
  },
  
  // Location/Address configuration
  location: {
    idField: 'id',
    labelFields: ['name', 'city', 'state'],
    separator: ', ',
    searchFields: ['code', 'country'],
    fallbackField: 'code'
  }
};

/**
 * Quick helper functions for common use cases
 */
export const createUserOptions = (data: any[]) => processDataToFormOptions({
  ...commonConfigs.user,
  data
});

export const createSimpleOptions = (data: any[]) => processDataToFormOptions({
  ...commonConfigs.simpleName,
  data
});

export const createProductOptions = (data: any[]) => processDataToFormOptions({
  ...commonConfigs.product,
  data
});

export const createLocationOptions = (data: any[]) => processDataToFormOptions({
  ...commonConfigs.location,
  data
});