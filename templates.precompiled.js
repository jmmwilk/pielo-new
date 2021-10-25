(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['about-pielo'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<p class=\"py-5\">\nWyszukiwarka sklepów z pieluszkami wielorazowymi to pierwsze narzędzie, które pojawiło się na Pielo.pl. Aby nie przegapić premiery kolejnych funkcjonalności zapisz się do newslettera i obserwuj nas na facebooku i instagramie.\n</p>\n<div>\n	<img id=\"justyna-img\" src=\"images/justyna.jpg\" class=\"float-start pb-3 pe-3\" style=\"height: 400px\">\n	<p>\n	Cześć,\n	</p>\n	<p>\n	jestem Justyna, wielo-mama z głową pełną pomysłów i odwagą do zmieniania świata. \n	</p>\n	<p>\n	Kiedy urodził się mój synek Leonardo, wkręciłam się w świat pieluszek wielorazowych. Szybko okazało się, że wybór jest ogromny! Od samych nazw systemów, rozmiarów i marek można dostać zawrotu głowy, a jeszcze trzeba pamiętać o właściwym dopasowaniu pieluszki do budowy dziecka. \n	</p>\n	<p>\n	Przekonałam się, że kupowanie wielo-pieluszek nie jest wcale takie proste, jak mi się wydawało. Zaczęłam się zastanawiać, co mogę z tym zrobić? Dla siebie i dla innych rodziców? Pomyślałam: a gdyby tak stworzyć porównywarkę, która pomoże w wyborze najlepszych pieluszek dla naszych dzieci? Tak zrodził się pomysł na Pielo.pl - portal pieluszek wielorazowych.\n\n	</p>\n	<p>\n	Wierzę, że łatwe wybieranie i kupowanie pieluszek wielorazowych zachęci coraz więcej rodziców do używania materiałów przyjaznych skórze maluchów i naszej planecie.\n	</p>\n</div>\n\n<p>\n\n</p>\n<p>\n\n</p>";
},"useData":true});
templates['badge'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"col\">\n	<div id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"brand-id") || (depth0 != null ? lookupProperty(depth0,"brand-id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"brand-id","hash":{},"data":data,"loc":{"start":{"line":2,"column":10},"end":{"line":2,"column":22}}}) : helper)))
    + "-"
    + alias4(((helper = (helper = lookupProperty(helpers,"badge-type") || (depth0 != null ? lookupProperty(depth0,"badge-type") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"badge-type","hash":{},"data":data,"loc":{"start":{"line":2,"column":23},"end":{"line":2,"column":37}}}) : helper)))
    + "\" class=\"brand-badge "
    + alias4(((helper = (helper = lookupProperty(helpers,"badge-type") || (depth0 != null ? lookupProperty(depth0,"badge-type") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"badge-type","hash":{},"data":data,"loc":{"start":{"line":2,"column":58},"end":{"line":2,"column":72}}}) : helper)))
    + " rounded-pill position-relative mb-2\" role=\"button\" brand-id="
    + alias4(((helper = (helper = lookupProperty(helpers,"brand-id") || (depth0 != null ? lookupProperty(depth0,"brand-id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"brand-id","hash":{},"data":data,"loc":{"start":{"line":2,"column":133},"end":{"line":2,"column":145}}}) : helper)))
    + ">\n		<div id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"brand-id") || (depth0 != null ? lookupProperty(depth0,"brand-id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"brand-id","hash":{},"data":data,"loc":{"start":{"line":3,"column":11},"end":{"line":3,"column":23}}}) : helper)))
    + "-"
    + alias4(((helper = (helper = lookupProperty(helpers,"badge-type") || (depth0 != null ? lookupProperty(depth0,"badge-type") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"badge-type","hash":{},"data":data,"loc":{"start":{"line":3,"column":24},"end":{"line":3,"column":38}}}) : helper)))
    + "-text\" class=\"position-absolute top-50 start-50 translate-middle text-nowrap\">\n			<small>"
    + alias4(((helper = (helper = lookupProperty(helpers,"brand-name") || (depth0 != null ? lookupProperty(depth0,"brand-name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"brand-name","hash":{},"data":data,"loc":{"start":{"line":4,"column":10},"end":{"line":4,"column":24}}}) : helper)))
    + "</small>\n		</div>\n	</div>\n</div>";
},"useData":true});
templates['brand'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<p brand-id="
    + alias4(((helper = (helper = lookupProperty(helpers,"brand-id") || (depth0 != null ? lookupProperty(depth0,"brand-id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"brand-id","hash":{},"data":data,"loc":{"start":{"line":1,"column":12},"end":{"line":1,"column":24}}}) : helper)))
    + ">"
    + alias4(((helper = (helper = lookupProperty(helpers,"brand-name") || (depth0 != null ? lookupProperty(depth0,"brand-name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"brand-name","hash":{},"data":data,"loc":{"start":{"line":1,"column":25},"end":{"line":1,"column":39}}}) : helper)))
    + "</p>";
},"useData":true});
templates['brands-list'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"mt-5 text-secondary small\">\n	Marki pieluszek wielorazowych, które wyszukasz w naszej wyszukiwarce ("
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"brands-number") || (depth0 != null ? lookupProperty(depth0,"brands-number") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"brands-number","hash":{},"data":data,"loc":{"start":{"line":2,"column":71},"end":{"line":2,"column":88}}}) : helper)))
    + "):\n</div>\n<div id=\"brands-list-wrapper\" class=\"mt-5\">\n</div>";
},"useData":true});
templates['go-back-text'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<a id=\"go-back-text\" class=\"link-secondary col-md-9 col-lg-10 col-xxl-10\">\n</a>";
},"useData":true});
templates['main-page'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"columns-wrapper\" class=\"row\">\n	<div id=\"left-column\" class=\"col-lg-6 col-md-8 col-sm-12 h-100\">\n		<div class=\"h-100\">\n			<div id=\"left-column-elements-wrapper\" class=\"w-100\">\n				<div id=\"diaper-icon-wrapper\" class=\"w-100 d-flex justify-content-center d-block d-md-none  d-lg-none d-xl-none d-xxl-none\">\n					<img id=\"diaper-icon\" src=\"images/diaper-icon.svg\"/>\n				</div>\n				<div id=\"title-wrapper\" class=\"row\">\n					<div class =\"col-md-8 col-sm-12 mt-2 mb-4 font-weight-bold text-center text-md-start\">\n						<h4 class=\"text-secondary mb-0\">Szukanie pieluszek <br> wielorazowych może być</h4>\n						<h4 class=\"text-warning\">proste.</h4>\n					</div>\n				</div>\n		      	<div id=\"selected-brands-wrapper\" class=\"row\">\n				</div>\n		      	<div id=\"selected-stores-wrapper\" class=\"d-none my-2 p-2 border rounded bg-white\">\n		      	</div>\n		      	<div id=\"go-back-text-wrapper\" class=\"row\">\n		      	</div>\n				<div id=\"search-box-container\" class=\"position-relative w-100\">\n				</div>\n				<div class=\"row\">\n					<div class=\"col-12 col-xxl-11\">\n						<div id=\"filtered-brands-wrapper\" class=\"d-flex mt-3 flex-wrap row row-cols-3 row-cols-xxl-4\">\n						</div>\n					</div>\n				</div>\n				<div id=\"search-button-wrapper\" class=\"row\">\n				</div>\n				<div class=\"row\">\n					<div class=\"col-12 col-md-9 col-lg-10\">\n						<div id=\"stores-wrapper\" class=\"text-warning\">\n						</div>\n					</div>\n				</div>\n			</div>\n		</div>\n	</div>\n	<div id=\"right-column\" class=\"col-lg-6 col-md-4 mt-1\">\n		<div id=\"background-image-wrapper\" class=\"align-self-center\">\n			<div class=\"w-100\">\n				<div id=\"background-image-container\" class=\"position-relative\">\n					<img id=\"lg-background-image\" class=\"lg-background-image\" src=\"images/lg-background-image.png\"/>\n					<img id=\"md-background-image\" class=\"md-background-image\" src=\"images/md-background-image.png\"/>\n				</div>\n			</div>\n		</div>\n	</div>\n</div>\n\n";
},"useData":true});
templates['matching-stores'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "<div class=\"col mb-5 d-flex align-items-center justify-content-center\">\n    <div id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"store-id") || (depth0 != null ? lookupProperty(depth0,"store-id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"store-id","hash":{},"data":data,"loc":{"start":{"line":2,"column":13},"end":{"line":2,"column":25}}}) : helper)))
    + "-store-logo-wrapper\" class=\"store-logo-wrapper\">\n      <a role=\"button\">\n        <img class=\"img-fluid\" src=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"store-logo") || (depth0 != null ? lookupProperty(depth0,"store-logo") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"store-logo","hash":{},"data":data,"loc":{"start":{"line":4,"column":36},"end":{"line":4,"column":50}}}) : helper)))
    + "\" id=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"store-id") || (depth0 != null ? lookupProperty(depth0,"store-id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"store-id","hash":{},"data":data,"loc":{"start":{"line":4,"column":56},"end":{"line":4,"column":68}}}) : helper)))
    + "-store-logo\">\n      </a>\n    </div>\n</div>";
},"useData":true});
templates['newsletter-page'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<!-- MailerLite Universal -->\n    <script>\n    (function(m,a,i,l,e,r){ m['MailerLiteObject']=e;function f(){\n    var c={ a:arguments,q:[]};var r=this.push(c);return \"number\"!=typeof r?r:f.bind(c.q);}\n    f.q=f.q||[];m[e]=m[e]||f.bind(f.q);m[e].q=m[e].q||f.q;r=a.createElement(i);\n    var _=a.getElementsByTagName(i)[0];r.async=1;r.src=l+'?v'+(~~(new Date().getTime()/1000000));\n    _.parentNode.insertBefore(r,_);})(window, document, 'script', 'https://static.mailerlite.com/js/universal.js', 'ml');\n\n    var ml_account = ml('accounts', '3216661', 'z0h5v3y8a5', 'load');\n    </script>\n    <!-- End MailerLite Universal -->\n\n<div class=\"ml-form-embed\"\n  data-account=\"3216661:z0h5v3y8a5\"\n  data-form=\"4233088:o3r9m1\">\n</div>";
},"useData":true});
templates['search-box'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div id=\"search-box\" class=\"bg-white\">\n	<div id=\"search-box-left-line\" class=\"h-100 position-absolute top-0 start-0 bg-warning\">\n	</div>\n	<div class=\"p-3 row w-100 mx-0\">\n		<div class=\"col px-0\">\n			<div class=\"input-group input-group-sm\">\n			  	<input id=\"search-box-input\" type=\"text\" class=\"form-control placeholder-color\" placeholder=\"Wpisz dowolną markę pieluszek\" onclick=\"this.placeholder = ''\">\n			</div>\n		</div>\n		<div class=\"col-1 px-0\">\n			<img id=\"magnifying-glass\" src=\"images/search-icon.png\"/>\n			<span class=\"glyphicon glyphicon-search\" aria-hidden=\"true\"></span>\n		</div>\n	</div>\n</div>";
},"useData":true});
templates['search-button'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"col-12 col-md-9 col-lg-10\">\n	<div id=\"search-button\" class=\"d-none position-relative bg-warning text-white w-100 mt-3\" role=\"button\">\n		<div class=\"position-absolute top-50 start-50 translate-middle text-nowrap\">\n			ZNAJDŹ SKLEP\n		</div>\n	</div>\n</div>";
},"useData":true});
templates['selected-brands'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"col-12 col-xxl-11\">\n	<div id=\"selected-items-wrapper\" class=\"d-flex flex-wrap row row-cols-3 row-cols-xxl-4 my-2\">\n		</div>\n</div>";
},"useData":true});
templates['stores'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<h6 id=\"stores-text\">\n</h6>\n<div id=\"matching-stores-wrapper\" class=\"row row-cols-3\">\n</div>\n";
},"useData":true});
templates['structure'] = template({"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\" container\">\n	<div id=\"head-and-main-wrapper\" class=\"d-flex flex-column min-vh-100\">\n		<div id=\"header\" class=\"row\">\n			<nav class=\"navbar navbar-expand-md navbar-light bg-white\">\n			    <a class=\"navbar-brand\" href=\"?page=start\">\n			      <img id=\"pielo\" src=\"images/pielo.png\" alt=\"\">\n			    </a>\n			    <button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#navbarTogglerDemo02\" aria-controls=\"navbarTogglerDemo02\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\n			      <span class=\"navbar-toggler-icon\"></span>\n			    </button>\n			    <div class=\"collapse navbar-collapse justify-content-end\" id=\"navbarTogglerDemo02\">\n			    	<div class=\"navbar-nav\">\n			    		<a class=\"nav-link me-5\" href=\"?page=lista-marek\">LISTA MAREK</a>\n				        <a class=\"nav-link me-5\" href=\"?page=o-pielo\">O PIELO</a>\n				        <a class=\"nav-link me-5\" id=\"newsletter-button\" href=\"?page=newsletter\">NEWSLETTER</a>\n				        <button class=\"btn btn-outline-warning\" id=\"fundraising-button\" type=\"button\">\n 				        WESPRZYJ</button>\n				    </div>\n			    </div>\n			</nav>\n		</div>\n		<div id=\"main\" class=\"flex-grow-1\">\n		</div>\n	</div>\n	<div id=\"footer\" class=\"footer-border-top mt-3 pt-4 pb-4\">\n		<div id=\"pielo-logo-footer\">\n			<h6>Pielo.pl</h6>\n		</div>\n		<div class=\"mt-2\">\n			<a onClick=\"window.open('https://docs.google.com/document/d/1d4LIkB3eOqfsAVcNuQTRHdfT5vhP3bP0ReJBcdK0acw/edit?usp=sharing', '_blank')\" href=\"#\" class=\"text-secondary\">Polityka prywatności</a>\n		</div>\n		<div>\n		<div class=\"d-flex flex-row\">\n			<div>\n				<img class=\"sm-icon me-3 mt-2\" role=\"button\" id=\"fb-icon\" src=\"images/fb-icon.png\" onClick=\"window.open('https://www.facebook.com/PIELO-Portal-Pieluszek-Wielorazowych-106164861536430', '_blank')\">\n			</div>\n			<div>\n				<img class=\"sm-icon mt-2\" role=\"button\" id=\"instagram-icon\" src=\"images/instagram-icon.png\" onClick=\"window.open('https://www.instagram.com/pielo_pl/', '_blank')\">\n			</div>\n		</div>\n	</div>\n</div>\n\n\n";
},"useData":true});
})();