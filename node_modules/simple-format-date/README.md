A simple clean way to format dates with Javascript

# Setup

```sh
npm install simple-format-date
```

# Usage

```js
import formatDate from 'simple-format-date';

// default output
formatDate(new Date(1973, 0, 2)); // => '1973-01-02'

// using a string as template
formatDate(new Date(1973, 0, 2), { template: '<%= DD %>/<%= MM %>/<%= YY %>' }); // => '02/01/1973' (italian format)

// using a function as template
const months = {
  '01': 'January',
  '02': 'February',
  '03': 'March',
  '04': 'April',
  '05': 'May',
  '06': 'June',
  '07': 'July',
  '08': 'August',
  '09': 'September',
  '10': 'October',
  '11': 'November',
  '12': 'December'
};

formatDate(new Date(1973, 0, 2), {
  template: (locals) => `${locals.DD}, ${months[locals.MM]} ${locals.YY}`
}); // => '02, January 1973'
```

# API

```js
formatDate(date, options)
```

where:

- `date` the date to format
- `options`
  - `template: string | (locals: Object) => string` the format to use in ejs syntax (default `<%= YY %>-<%= MM %>-<%= DD %>`) where `locals` is an object containing the following keys:
    - `Y` short year (`'15'` for 2015)
    - `YY` numeric long year (`2015`)
    - `M` numeric month (`9` for September)
    - `MM` padded month (`'09'` for September)
    - `D` numeric day
    - `DD` padded day
    - `h` numeric hours
    - `hh` padded hours
    - `m` numeric minutes
    - `mm` padded minutes
    - `s` numeric seconds
    - `ss` padded seconds
  or a function returning a template