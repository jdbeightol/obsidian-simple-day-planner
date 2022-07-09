export const BREAK_LABEL="<Break>"
export const END_LABEL="<End of Plan>"

export const DEFAULT_DATE_FORMAT = 'YYYYMMDD';
export const DATE_REGEX = /(?<target>{{date:?(?<date>[^}]*)}})/g;

// https://regex101.com/r/reJ6Rg/1
export const PLAN_PARSER_REGEX='^(((-(\\s+\\[?[x ]\\])?)(\\d.)?\\s+(?<hours>\\d{1,2}):(?<minutes>\\d{2})\\s+)((?<break>[Bb][Rr][Ee][Aa][Kk][\\n ]?)|(?<end>[Ee][Nn][Dd][\\n ]?)|((?<text>.*))))$'

export const VIEW_TYPE_TIMELINE = 'timeline';

export const TIMELINE_DEFAULT_ZOOM = 2;
