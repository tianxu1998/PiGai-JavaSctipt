// ==UserScript==
// @name         批改网脚本
// @namespace    https://greasyfork.org/zh-CN/scripts/384616-%E6%89%B9%E6%94%B9%E7%BD%91%E8%84%9A%E6%9C%AC
// @version      2019.06.06
// @description  自动登录及取消禁止粘贴
// @author       Brush-JIM
// @match        *://*.pigai.org/*
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_deleteValue
// @grant        GM.deleteValue
// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @supportURL   https://greasyfork.org/zh-CN/scripts/384616-%E6%89%B9%E6%94%B9%E7%BD%91%E8%84%9A%E6%9C%AC
// ==/UserScript==

(function() {
    'use strict';
    function gm_get( name , defaultValue ) {
        if ( typeof GM_getValue === 'function' ) {
            return new Promise ( ( resolve , reject ) => {
                resolve( GM_getValue( name , defaultValue ) );
            } )
        }
        else {
            return GM.getValue( name , defaultValue );
        }
    }
    function gm_set( name , defaultValue ) {
        if ( typeof GM_setValue === 'function' ) {
            GM_setValue( name , defaultValue );
        }
        else {
            GM.setValue( name ,defaultValue );
        }
    }
    function gm_del( name ) {
        if ( typeof GM_deleteValue === 'function' ) {
            GM_deleteValue( name );
        }
        else {
            GM.deleteValue( name );
        }
    }
    if ( window.location.href.indexOf( 'http://www.pigai.org/index.php?a=loginForm' ) != -1 ) {
        $(function(){
            gm_get('username',undefined).then((username)=>{
                gm_get('password',undefined).then((password)=>{
                    if (username===''||username===undefined||password===''||password===undefined){
                        $('.regButton').find('button').click(function(){
                            gm_set('username',$('#userName').val());
                            gm_set('password',$('#password').val());
                            $('input[name="remember"][type="checkbox"]')[0].checked=false;
                        })
                    }
                    else {
                        $('#userName').val(username);
                        $('#password').val(password);
                        $('input[name="remember"][type="checkbox"]')[0].checked=false;
                        $('.regButton').find('button').click();
                    }
                    $('.regButton').find('button').click(function(){
                        gm_set('username',$('#userName').val());
                        gm_set('password',$('#password').val());
                        $('input[name="remember"][type="checkbox"]')[0].checked=false;
                    })
                })
            })
        })
    }
    else if ( window.location.href.indexOf('a=write')!= -1 || window.location.href.indexOf('rid=')!=-1) {
        $(function(){
            unsafeWindow.$('#contents').off();
            $('a[id="dafen"]').before('|<a class="d3" id="Unban paste">手动取消禁止粘贴</a>|');
            console.log($('#contents'))
            $('a[id="Unban paste"]').on('click',function(){unsafeWindow.$('#contents').off()});
            unsafeWindow.document.addEventListener('click',function(){unsafeWindow.$('#contents').off()})
        });
    }
    else {
        $(function(){
            if ( $('#username').length != 0 ) {
                gm_get( 'username' ,undefined ).then( ( username ) => {
                    gm_get( 'password' , undefined ).then( ( password ) => {
                        if ( username === '' || username === undefined || password === '' || password === undefined ) {
                            $('#ulogin').off();
                            $('#ulogin').click( function () {
                                gm_set( 'username' , $('#username').val() );
                                gm_set( 'password' , $('#password').val() );
                                $('input[id="rmb_c"]')[0].checked;
                                unsafeWindow.login();
                            })
                        }
                        else {
                            $('#username').val( username );
                            $('#password').val( password );
                            $('input[id="rmb_c"]')[0].checked
                            $('#lg_from_w').submit()
                        }
                        $('#ulogin').off();
                        $('#ulogin').click( function () {
                            gm_set( 'username' , $('#username').val() );
                            gm_set( 'password' , $('#password').val() );
                            $('input[id="rmb_c"]')[0].checked
                            unsafeWindow.login();
                        })
                    } )
                } )
            }
        })
    }
    $(function(){
        if ($('a[id="pigai_logout"]').length!=0){
            $('a[id="pigai_logout"]')[0].innerText = '重新登录';
            $('a[id="pigai_logout"]').after('|<a id="reset_login">重置登录信息</a>');
            $('a[id="reset_login"]').on('click',function(){
                gm_del('username');
                gm_del('password');
                alert('用户密码重置成功，下次登录将不会自动登录。');
                $('a[id="reset_login"]').remove();
            })
        }
    })
})();