import { FileType } from '../types';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const detectFileType = (fileName: string): FileType | null => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'json':
      return 'json';
    case 'xml':
      return 'xml';
    case 'xlsx':
    case 'xls':
      return 'excel';
    case 'tsv':
      return 'tsv';
    default:
      return null;
  }
};

export const generatePreviewData = async (file: File, fileType: FileType): Promise<string[][]> => {
  try {
    switch (fileType) {
      case 'json':
        return await parseJsonFile(file);
      case 'xml':
        return await parseXmlFile(file);
      case 'tsv':
        return await parseTsvFile(file);
      case 'excel':
        return await parseExcelFile(file);
      default:
        throw new Error('Unsupported file type');
    }
  } catch (error) {
    console.error('Error generating preview:', error);
    throw error;
  }
};

const parseJsonFile = async (file: File): Promise<string[][]> => {
  const content = await readFileAsText(file);
  const parsedData = JSON.parse(content);
  
  if (Array.isArray(parsedData)) {
    if (parsedData.length === 0) return [['Empty array']];
    
    const firstItem = parsedData[0];
    if (typeof firstItem === 'object' && firstItem !== null) {
      const headers = getAllKeys(parsedData);
      const rows = [headers];
      
      parsedData.forEach(item => {
        const row = headers.map(header => {
          const value = getNestedValue(item, header);
          return formatValue(value);
        });
        rows.push(row);
      });
      
      return rows;
    } else {
      return [['Value'], ...parsedData.map(item => [formatValue(item)])];
    }
  } else if (typeof parsedData === 'object' && parsedData !== null) {
    const flattened = flattenObject(parsedData);
    const headers = Object.keys(flattened);
    const values = headers.map(key => formatValue(flattened[key]));
    return [headers, values];
  }
  
  throw new Error('Invalid JSON structure');
};

const parseXmlFile = async (file: File): Promise<string[][]> => {
  const content = await readFileAsText(file);
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(content, 'text/xml');
  
  if (xmlDoc.documentElement.nodeName === 'parsererror') {
    throw new Error('Invalid XML format');
  }

  const data = xmlToJson(xmlDoc.documentElement);
  return convertToTable(data);
};

const parseTsvFile = async (file: File): Promise<string[][]> => {
  const content = await readFileAsText(file);
  return new Promise((resolve, reject) => {
    Papa.parse(content, {
      delimiter: '\t',
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error('Failed to parse TSV file'));
        } else {
          resolve(results.data as string[][]);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

const parseExcelFile = async (file: File): Promise<string[][]> => {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer);
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
};

const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
};

const getAllKeys = (array: any[]): string[] => {
  const keysSet = new Set<string>();
  array.forEach(item => {
    if (typeof item === 'object' && item !== null) {
      Object.keys(flattenObject(item)).forEach(key => keysSet.add(key));
    }
  });
  return Array.from(keysSet);
};

const flattenObject = (obj: any, prefix = ''): Record<string, any> => {
  return Object.keys(obj).reduce((acc: Record<string, any>, key: string) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], pre + key));
    } else {
      acc[pre + key] = obj[key];
    }
    return acc;
  }, {});
};

const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

const formatValue = (value: any): string => {
  if (value === null) return 'null';
  if (value === undefined) return '';
  if (Array.isArray(value)) return JSON.stringify(value);
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

const xmlToJson = (xml: Element): any => {
  const obj: any = {};

  if (xml.children.length > 0) {
    for (const child of xml.children) {
      const nodeName = child.nodeName;
      if (obj[nodeName]) {
        if (!Array.isArray(obj[nodeName])) {
          obj[nodeName] = [obj[nodeName]];
        }
        obj[nodeName].push(xmlToJson(child));
      } else {
        obj[nodeName] = xmlToJson(child);
      }
    }
  } else {
    obj.value = xml.textContent?.trim() || '';
  }

  return obj;
};

const convertToTable = (data: any): string[][] => {
  const headers = new Set<string>();
  const rows: any[] = [];

  const processObject = (obj: any, currentRow: any = {}) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => processObject(item, { ...currentRow }));
      } else if (typeof value === 'object' && value !== null) {
        processObject(value, currentRow);
      } else {
        headers.add(key);
        currentRow[key] = value;
      }
    });
    if (Object.keys(currentRow).length > 0) {
      rows.push(currentRow);
    }
  };

  processObject(data);
  const headerArray = Array.from(headers);
  return [
    headerArray,
    ...rows.map(row => headerArray.map(header => formatValue(row[header])))
  ];
};

export const convertToCSV = (data: string[][]): string => {
  return Papa.unparse(data, {
    quotes: true,
    quoteChar: '"',
    escapeChar: '"',
    delimiter: ",",
    header: true,
    newline: "\n"
  });
};