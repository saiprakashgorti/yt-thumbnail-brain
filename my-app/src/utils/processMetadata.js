export const processMetadata = (rawData) => {
  return rawData.map((item, index) => ({
    id: `thumbnail_${index + 1}`,
    title: item.Title,
    views: parseInt(item.Views.replace(/,/g, "")),
    duration: parseInt(item["Length (seconds)"]),
    uploadDate: formatDate(item["Upload Date"]),
    uploader: item.Uploader,
    tags: item.Tags.split(", "),
    thumbnailFile: `youtube_thumbnail_${index + 1}.jpg`,
    description: item.Description,
  }));
};

// Helper function
const formatDate = (excelDate) => {
  const date = new Date((excelDate - 25569) * 86400 * 1000);
  return date.toISOString().split("T")[0];
};
