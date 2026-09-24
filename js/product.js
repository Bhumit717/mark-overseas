
let itemContent = document.getElementById("item-content")
let itemMoreContent = document.getElementById("item-more-content")
let itemImg = document.getElementById("item-img")
let productTitle = document.getElementById("product-title")
let productPageTitle = document.getElementById("product-page-title")
let productTitleArea = document.getElementById("product-title-area")
let titleItem = document.getElementById("title-item")
let productItems = document.getElementById("product-items")
let productImg = document.getElementById("product-img")
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).replaceAll("_"," ");
}

async function getProductDetails(area, link) {
    try {
        const res = await fetch("/get-product-details", {
            method: "POST",
            body: JSON.stringify({ link: link }),
            headers: { "Content-Type": "application/json" },
        });
        const result = await res.json();
        // console.log(result);
        if (!result.success) {
            alert("Product Not Available")
            window.location.href = "/";
        }

        const titleImg = document.createElement("img")

        if (result.main) {
            // For Main Menu
            titleImg.src = `/images/productImage/${result.data.image}`
            titleImg.alt = createContent(result.data.imageAlt, area)

            productPageTitle.innerHTML = `<p style="font-size: 4rem; text-transform: uppercase;" uk-scrollspy="cls: uk-animation-fade; repeat: true; delay: 200">${result.data.productName}</p> <h1 style="font-size: 2rem;" class="text-white" uk-scrollspy="cls: uk-animation-fade; repeat: true; delay: 200">${createContent(result.data.productTitle, area)}</h1>`

            productTitle.innerHTML = `<h2 class="text-center">${createContent(result.data.productTitle, area)}</h2>`
            productImg.innerHTML = `<img src="/images/productImage/${result.data.image}" title="${createContent(result.data.imageTitle)}" alt="${createContent(result.data.imageAlt, area)}>"`
            itemContent.innerHTML = createAreaContent(result.data.productDesc, area, result.data.marketAreaDesc)
        } else {
            // For Sub-Menu
            titleImg.src = `/images/productImage/${result.data.productItemImage}`
            titleImg.alt = createContent(result.data.productItemImageAlt, area)

            productPageTitle.innerHTML = `<p style="font-size: 4rem; text-transform: uppercase;" uk-scrollspy="cls: uk-animation-fade; repeat: true; delay: 200">${result.data.productItemName}</p> <h1 style="font-size: 2rem;" class="text-white" uk-scrollspy="cls: uk-animation-fade; repeat: true; delay: 200">${createContent(result.data.productItemTitle, area)}</h1>`

            productImg.innerHTML = `<img src="/images/productImage/${result.data.productItemImage}" title="${createContent(result.data.productItemImageTitle, area)}" alt="${createContent(result.data.productItemImageAlt, area)}">`
            itemContent.innerHTML = createAreaContent(result.data.productItemDesc, area, result.data.productItemMarketAreaDesc)
        }
        titleImg.style.position = 'absolute'
        titleImg.style.width = '100%'
        titleImg.style.opacity = '0.6'
        productTitleArea.append(titleImg)

        // if (useLocation.includes("market")) {
        //     itemContent.innerHTML += result.main ? result.data.marketAreaDesc.replaceAll('India', `<strong >${capitalize(area)}</strong>`) : result.data.productItemMarketAreaDesc.replaceAll('India', `<strong >${capitalize(area)}</strong>`)

        // document.getElementsByTagName('meta')["keywords"].content = result.main ? result.data.areaMetaKeywords.replaceAll('Delhi', capitalize(area)) : result.data.productItemAreaMetaKeywords.replaceAll('Delhi', capitalize(area))

        // document.title = result.main ? result.data.areaMetaTitle.replaceAll('Delhi', capitalize(area)) : result.data.productItemAreaMetaTitle.replaceAll('Delhi', capitalize(area));
        // } else {

        // document.getElementsByTagName('meta')["keywords"].content = result.main ? result.data.seoMetaKeywords : result.data.productItemSeoMetaKeywords

        // document.title = result.main ? result.data.seoMetaTitle : result.data.productItemSeoMetaTitle;
        // }

        // if (result.main && result.listData.length) {
        //     productItems.innerHTML = '<h3 class="text-center py-5">Product List</h3>'
        //     result.listData.forEach(el => {
        //         if (el.productItemStatus == 1) {
        //             productItems.innerHTML += `<div class="col-lg-6 p-5 superb-products-item">
        //             <div class="watch-area">
        //                 <a href="${createLink(el.productItemLink)}">
        //                     <div class="container">
        //                         <div class="watch-item">
        //                             <div class="watch-inner">
        //                                 <div class="video-wrap rounded overflow-hidden">
        //                                     <img src="/images/productImage/${el.productItemImage}" title=${el.productItemImageTitle} alt=${el.productItemImageAlt}>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </a>
        //             </div>
        //             <div class="support-area py-2">
        //                 <div class="container">
        //                     <div class="support-item text-white">
        //                         <a href="${createLink(el.productItemLink)}">
        //                             <h3 class="my-2">${el.productItemName}</h3>
        //                         </a>
        //                         <p>${el.productItemDesc.substring(0, 250)}</p>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>`
        //         }
        //     });
        // }
    } catch (error) {
        console.log(error);
    }
}

const createContent = (content, area) => {
    console.log(content);
    if (useLocation.includes("market")) {
        return content.replaceAll('India', `<strong >${capitalize(area)}</strong>`)
    } else {
        return content
    }
}

const createAreaContent = (content, area, areaContent) => {
    if (useLocation.includes("market")) {
        return areaContent.replaceAll('India', `<strong >${capitalize(area)}</strong>`)
    } else {
        return content
    }
}
// getProductDetails(useLocation[useLocation.length - 2], useLocation[useLocation.length - 1])