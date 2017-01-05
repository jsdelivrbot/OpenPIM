'use strict';

$(document).foundation();

$(function() {
  var encPrivArea = $('#encprivatekey');
  var pubArea = $('#publickey');
  var passInput = $('#password');
  var decryptBt = $('#decrypt');
  var privArea = $('#privatekey');
  var notesSelect = $('#notes');
  var textArea = $('#text');
  var notes = null;
  var privateKey = null;

  $.ajaxSettings = $.extend($.ajaxSettings, {
    'error': function(xhr, errorType, error) {
      console.error(error);
    }
  });

  $.get('nsantos.pem', function(response) {
    encPrivArea.text(response);
  });

  $.get('nsantos.pub', function(response) {
    pubArea.text(response);
  });

  // $.get('nsantos.priv', function(response) {
  //  privArea.text(response);
  // });

  $.getJSON('notes.json', function(data) {
    notes = data;
    notesSelect.empty();
    notesSelect.append($('<option value="">---</option>'));

    for(var k in notes) {
      if(notes.hasOwnProperty(k)) {
        var v = notes[k];
        notesSelect.append($('<option></option>').val(k).html(v['title']));
      }
    }
  });

  decryptBt.on('click', function(e) {
    var encPem = encPrivArea.text();
    var password = passInput.val();

    privateKey = forge.pki.decryptRsaPrivateKey(encPem, password);

    if(privateKey == null) {
      privArea.empty();
      return;
    }

    var decPem = forge.pki.privateKeyToPem(privateKey);

    privArea.text(decPem);
  });

  notesSelect.on('change', function(e) {
    var k = $(this).val();

    if(privateKey == null || !notes.hasOwnProperty(k)) {
      textArea.empty();
    } else {
      var encrypted = forge.util.decode64(notes[k]['note']);
      var decrypted = privateKey.decrypt(encrypted);
      textArea.text(decrypted);
    }
  });
});
