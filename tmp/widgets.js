$(document).on('click','.wc165tab',function(){var cls='wc165selected',vis='wc165visible',el=$(this);el.parent().find('.'+cls).rclass(cls);el.aclass(cls);var p=el.closest('.wb');p.find('> .'+vis).rclass(vis);p.find('> .wc165content').eq(el.index()).aclass(vis)});$("div button.btn-project").click(function(){var city=$(this).parent().parent().find("h5").text();var project=$(this).parent().parent().find("h4").text();$("#form_project").attr('value',project);$("#form_city").attr('value',city)});