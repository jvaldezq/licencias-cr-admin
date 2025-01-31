// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

export async function getChanges<T>(
  model: T, // Prisma model (e.g., prisma.asset, prisma.user)
  id: string | number, // ID of the record
  updatedData: object, // Updated data to compare
): Promise<T> {
  // Fetch the current record from the database
  const currentRecord = await model.findUnique({
    where: { id },
  });

  if (!currentRecord) {
    throw new Error('Record not found');
  }

  const changes = [];

  // Compare each key in the updated data with the current record
  Object.keys(updatedData).forEach((key) => {
    if (currentRecord[key] !== updatedData[key]) {
      changes.push({
        old: currentRecord[key],
        new: updatedData[key],
      });
    }
  });

  return changes;
}
