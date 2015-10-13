/**
 * Created by xueyan.hu on 2015/9/28.
 */
define(function(require, exports, module) {
    var Xss = require("xss"),
        _cacheDataDictionary = {},
        art_dialog = require('dialog');

    function renderSelect(el, options) {
        var selctArray = $(el).find("[dict-name]"),
            dataArray,
            dictName,
            l = arguments.length;
        if (selctArray.length) {
            $.each(selctArray, function (i, k) {
                dictName = $(k).attr("dict-name");
                getData(dictName, function (res) {
                    dataArray = res.dataArray || [];
                    if (dataArray.length) {
                        for (var i = 0; i < dataArray.length; i++) {
                            $(k).append('<option value="' +
                                ((l === 2) ? dataArray[i][options.value] : dataArray[i].innerValue) + '">' +
                                ((l === 2) ? Xss.inHTMLData(dataArray[i][options.label]) : dataArray[i].label)
                                + '</option>');
                        }
                    }
                });
            });
        }
    }

    function getData(type, callback) {
        if (_cacheDataDictionary[type]) {
            callback(_cacheDataDictionary[type]);
            return;
        }
        $.ajax({
            url: global_config.serverRoot + 'dataDictionary/dropdownlist?userId=' + '&type=' + type,
            success: function (res) {
                if (res.code == 0) {
                    _cacheDataDictionary[type] = res.data;
                    callback(res.data);
                } else {
                    art_dialog.error('错误', res.msg);
                }
            }
        });
    }

    return renderSelect;

});