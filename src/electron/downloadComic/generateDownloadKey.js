export default function generateDownloadKey ({ comicId, episodesOrder }) {
  return comicId + '#' + episodesOrder
}
