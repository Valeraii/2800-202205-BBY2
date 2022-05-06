//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------

function loadSkeleton() {
    console.log($('#headerPlaceholder').load('js/header.html'));
    console.log($('#footerPlaceholder').load('js/footer.html'));
}


loadSkeleton();