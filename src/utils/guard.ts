export const exhaustiveGuard = (value: unknown) => {
  throw new Error(
    `Error! Reached forbidden guard function with unexpected value: ${JSON.stringify(
      value
    )}`
  );
};
