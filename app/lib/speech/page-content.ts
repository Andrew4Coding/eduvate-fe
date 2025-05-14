export default function getPageContent() {
    const pageContentElements = document.querySelectorAll('[aria-description="content"]');

    const pageContent = Array.from(pageContentElements)
        .map(element => {
            const clone = element.cloneNode(true) as HTMLElement;

            // Hapus class dari root element itu sendiri
            clone.removeAttribute('class');

            // Hapus class dari semua anak dan cucunya
            const allDescendants = clone.querySelectorAll('*');
            allDescendants.forEach(el => el.removeAttribute('class'));

            return clone.innerHTML;
        })
        .filter(html => html.trim() !== '')
        .join(' ');

    console.log("pageContent", pageContent);

    return pageContent;
}
