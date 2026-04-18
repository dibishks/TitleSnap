const UTC_TIMESTAMP_WITHOUT_ZONE =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?$/;

const HAS_TIMEZONE_SUFFIX = /(Z|[+-]\d{2}:\d{2})$/i;

export const parseApiUtcDateTime = (value: string) => {
  const normalizedValue =
    UTC_TIMESTAMP_WITHOUT_ZONE.test(value) && !HAS_TIMEZONE_SUFFIX.test(value)
      ? `${value}Z`
      : value;

  return new Date(normalizedValue);
};
