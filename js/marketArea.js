const marketAreaList = document.getElementById("market-area-list")
const getMarketArea1 = async () => {
    try {
        const res = await fetch("/get-market-area", {
            method: "POST",
            body: JSON.stringify({ link: "link" }),
            headers: { "Content-Type": "application/json" },
        });
        const result = await res.json();
        console.log(result);
        result.data.forEach(el => {
            marketAreaList.innerHTML += `<li class="col-sm-2">
                        <a class="btn btn-outline-primary w-100" href=/market/${el.marketAreaLink} id=${el.marketAreaLink}>
                            ${el.marketAreaName}
                        </a>
                    </li>`
        });
    } catch (error) {
        console.log(error);
    }
}
getMarketArea1()
