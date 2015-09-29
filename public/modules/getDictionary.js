/**
 * Created by xueyan.hu on 2015/9/28.
 */
define(function(require, exports, module) {
    var businessTypeArr = {},
        art_dialog = require('dialog'),
        businessTypeDefault = '';
    //ajax request
    function getDictionary(type, $el) {
        $.ajax({
            url: global_config.serverRoot + 'dataDictionary/dropdownlist?userId=' + '&type=' + type,
            success: function (res) {
                if (res.code == 0) {
                    businessTypeArr = res.data && res.data.dataArray || [];
                    if (businessTypeArr.length) {
                        businessTypeDefault = businessTypeArr[0].id;
                        setBusinessType($el);
                    }
                } else {
                    art_dialog.error('错误', res.msg);
                }
            }
        });
    }
    //render html
    function setBusinessType(dom, selected) {
        var s = '';
        for (var i = 0; i < businessTypeArr.length; i++) {
            if (selected == businessTypeArr[i].id) {
                s = ' selected = "selected"';
            } else {
                s = '';
            }
            dom.append('<option value="' + businessTypeArr[i].id + '"' + s + '>' + Xss.inHTMLData(businessTypeArr[i].label) + '</option>');
        }
    }

    return getDictionary;

});