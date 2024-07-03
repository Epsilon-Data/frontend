import { AnalysisInfo } from '@app/api/datasets.api';
import { t } from 'i18next';

export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATASET_API_URL = '/hub/dataset/';

export const INITIAL_DETAIL_VALUES: AnalysisInfo = {
  id: '',
  name: '',
  description: '',
  scripts: [],
};

export const CSV_REGEX = /(\w+)\s*<-\s*(read\.csv|read_csv|read\.csv2)\(.+\)/g;

export const PARAMETRIC = [
  {
    value: true,
    label: 'Parametric test',
  },
  {
    value: false,
    label: 'Non-parametric test',
  },
];

export const ALT_HYPOTHESIS = [
  {
    value: 'unequal',
    label: 'Population ≠ Test Value',
  },
  {
    value: 'greater',
    label: 'Population > Test Value',
  },
  {
    value: 'lesser',
    label: 'Population < Test Value',
  },
];

export const CALC_OPTIONS = [
  {
    value: 'mean',
    label: t('dataset.standard.descriptive.calculate.mean'),
  },
  {
    value: 'median',
    label: t('dataset.standard.descriptive.calculate.median'),
  },
  {
    value: 'mode',
    label: t('dataset.standard.descriptive.calculate.mode'),
  },
  {
    value: 'min',
    label: t('dataset.standard.descriptive.calculate.min'),
  },
  {
    value: 'max',
    label: t('dataset.standard.descriptive.calculate.max'),
  },
  {
    value: 'sd',
    label: t('dataset.standard.descriptive.calculate.sd'),
  },
  {
    value: 'var',
    label: t('dataset.standard.descriptive.calculate.var'),
  },
];

export const VAR_OPTIONS = [
  {
    value: 'ord',
    label: 'Ordinal',
  },
  {
    value: 'nom',
    label: 'Nominal',
  },
];

export const GUIDE_CONTENT = `
### Guide to Using the Standard Analyses

#### Variable Types
1. **Ordinal Variables**: These are variables with a clear, ordered ranking. Example: survey ratings (e.g., poor, fair, good, excellent) and class ranks.
2. **Nominal Variables**: These are categorical variables without any intrinsic order. Examples: gender, nationality.

#### Statistical Calculations
1. **Mean**: The average of a set of numbers.
2. **Median**: The middle value in a set of numbers arranged in ascending order. If there's an even number of values, the median is the average of the two middle numbers.
3. **Mode**: The value that appears most frequently in a data set. A set can have more than one mode or none at all if no number repeats.
4. **Standard Deviation**: A measure of the amount of variation or dispersion in a set of values. A low standard deviation means the values are close to the mean, while a high standard deviation means they are spread out over a wider range.
5. **Variance**: The square of the standard deviation. It measures the degree of spread in the data set.
6. **Minimum**: The smallest value in a data set.
7. **Maximum**: The largest value in a data set.

#### Steps to Use the Page
1. **Select Variables**: Select the variables you want to analyse.
2. **Set Variable Types**: For each selected variable, specify whether it is ordinal or nominal.
3. **Select Calculations**: Choose the statistical calculations (mean, median, mode, standard deviation, variance, minimum, maximum) you want to apply.
4. **Generate Results**: Click on the "Generate" button to perform the calculations and view the output.

By following these steps, you can effectively analyze your data and gain insights through various statistical measures.
`;
