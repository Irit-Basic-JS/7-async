const API = {
	organizationList: "/orgsList",
	analytics: "/api3/analytics",
	orgReqs: "/api3/reqBase",
	buhForms: "/api3/buh",
};

async function run() {
	const organizationResponse = await sendRequest(API.organizationList);
	const allOrgsNames = organizationResponse.join(",");
	Promise
        .all([sendRequest(`${API.orgReqs}?ogrn=${allOrgsNames}`),
            sendRequest(`${API.analytics}?ogrn=${allOrgsNames}`),
            sendRequest(`${API.buhForms}?ogrn=${allOrgsNames}`)])
	    .then(([requisites, analytics, buh]) => {
            const orgsMap = reqsToMap(requisites);
            addInOrgsMap(orgsMap, analytics, "analytics");
            addInOrgsMap(orgsMap, buh, "buhForms");
            render(orgsMap, organizationResponse);
        })
        .catch(reason => alert(`Error!!!\nReason: ${reason.textContent}`));
}

run();

async function sendRequest(url) {
	const response = await fetch(url);

	if (response.ok) {
		return JSON.parse(await response.text());
	} 
    
    if (response.status >= 300) {
		alert(`Response status: ${response.status}`);
	}
}

function reqsToMap(requisites) {
    return requisites.reduce((acc, item) => {
        acc[item.ogrn] = item;
        return acc;
    }, {});
}

function addInOrgsMap(orgsMap, additionalInfo, key) {
    for (const item of additionalInfo) {
        orgsMap[item.ogrn][key] = item[key];
    }
}

function render(allOrgsNamesInfo, allOrgsNamesOrder) {
    const table = document.getElementById("allOrgsNames");
    table.classList.remove("hide");

    const template = document.getElementById("orgTemplate");
    const container = table.querySelector("tbody");

    allOrgsNamesOrder.forEach((item) => {
        renderOrganization(allOrgsNamesInfo[item], template, container);
    });
}

function renderOrganization(orgInfo, template, container) {
    const clone = document.importNode(template.content, true);
    const name = clone.querySelector(".name");
    const indebtedness = clone.querySelector(".indebtedness");
    const money = clone.querySelector(".money");
    const address = clone.querySelector(".address");

    name.textContent =
        (orgInfo.UL && orgInfo.UL.legalName && orgInfo.UL.legalName.short) ||
        "";
    indebtedness.textContent = formatMoney(orgInfo.analytics.s1002 || 0);

    if (
        orgInfo.buhForms &&
        orgInfo.buhForms.length &&
        orgInfo.buhForms[orgInfo.buhForms.length - 1] &&
        orgInfo.buhForms[orgInfo.buhForms.length - 1].year === 2017
    ) {
        money.textContent = formatMoney(
            (orgInfo.buhForms[orgInfo.buhForms.length - 1].form2 &&
                orgInfo.buhForms[orgInfo.buhForms.length - 1].form2[0] &&
                orgInfo.buhForms[orgInfo.buhForms.length - 1].form2[0]
                    .endValue) ||
                0
        );
    } else {
        money.textContent = "—";
    }

    const addressFromServer = orgInfo.UL.legalAddress.parsedAddressRF;
    address.textContent = createAddress(addressFromServer);

    container.appendChild(clone);
}

function formatMoney(money) {
    let formatted = money.toFixed(2);
    formatted = formatted.replace(".", ",");

    const rounded = money.toFixed(0);
    const numLen = rounded.length;
    for (let i = numLen - 3; i > 0; i -= 3) {
        formatted = `${formatted.slice(0, i)} ${formatted.slice(i)}`;
    }

    return `${formatted} ₽`;
}

function createAddress(address) {
    const addressToRender = [];
    if (address.regionName) {
        addressToRender.push(createAddressItem("regionName"));
    }
    if (address.city) {
        addressToRender.push(createAddressItem("city"));
    }
    if (address.street) {
        addressToRender.push(createAddressItem("street"));
    }
    if (address.house) {
        addressToRender.push(createAddressItem("house"));
    }

    return addressToRender.join(", ");

    function createAddressItem(key) {
        return `${address[key].topoShortName}. ${address[key].topoValue}`;
    }
}
