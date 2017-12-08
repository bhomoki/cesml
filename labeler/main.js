$(document).ready(function () {
    initialize();
});

var ordinal = 0;
var dataSize = 0;
var blank = "[blank]";
var sampleLabel;
var labelsDefault = {
    "QKAPINGen": "DCATMQK /'Card_PIN related/'A_PIN _ Denial/'APIN generation",
    "QKChgEmailId": "SACQK/'Demographics/'Email Id _ Denial/'Change in e_mail ID procedure",
    "QKDcardReqPro": "DCATMQK/'Card_PIN related/'Debit Card issuance _ Denial/'Alternate channels to apply for Debit Card",
    "QKMobRegAbroad": "IBMBQK/'Mobile Banking/'Registration_De_registration _ Denial/'Procedure for updating International Mobile number",
    "QKIbactiv": "IBMBQK/'Login/'User ID related _ Denial/'Activating Internet banking _User ID_",
    "QKMobAlerReg": "IBMBQK/'Mobile Banking/ 'Registration_De_registration _ Denial/'Mobile Banking registration",
    "FCBADDUPDPROREG": "Transactions_Payments_Statements_Demographics FCB/'Address Change/'FCBADDUPDPROREG/'Address Change Process Registered",
    "FCBCHGMOBREGACC": "Internet Banking_Alerts_Credit Limit FCB /'Alerts/ 'Mobile registration_Denial/'Change of mobile number Registered",
    "FCBALEEMAILREGREG": "Internet Banking_Alerts_Credit Limit FCB/'Alerts/'Email Registration/'Change of e_mail id Registered",
    "QKLNKNGPROREG": "Internet Banking_Alerts_Credit Limit QK/'Internet Banking",
    "QKAPINGENENQPINREG": ""
};


var sampleData = 
[
  {
    "threadId": "000A9aD1AP57XJK7",
    "subject": "aaaaaaaaaaaaaaaa:level1complaint/Credit Card",
    "body": "\nName: aaaaaaaaaaaa\nProduct: aaaaaaaaaaaaaAccount No: aaaaaaaaaaaaaaaa\nApplication No: \nE-mail address: aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa no: aaaaaaaaaa\nTelephone no: +aa--\nService Request(SR) No:\nDetails of  complaint: Dera team \nI have recieved mY cradit card of last month thanks for card but I have recieved this month bill of card due to unnessary charges &amp;amount I have no any transactions in card why pay any amount deducted in my card value please help\nkindly refund of all deducted amount of card value\naaaaaaaaaaa; regards\naaaaaa rawat\n",
    "intent": "address change process registered",
    "labels": "CC/Card details/Customer details updation/Address Change Process"
  },
  {
    "threadId": "000A9aD1AP57Q6XW",
    "subject": "aaaaaaaaaaaaaaaa:level1complaint/Credit Card",
    "body": "\nName: aaaaaaaaaaaaaaaaaaaa\nProduct: aaaaaaaaaaaaaAccount No: aaaaaaaaaaaaaaaa\nApplication No: \nE-mail address: aaaaaaaaaaaaaaaaaaaaaaaaaaaaa no: aaaaaaaaaa\nTelephone no: +aaaaaaaaaaaaaaa\nService Request(SR) No:\nDetails of  complaint: I had never taken aaaaaaaaaaa in my name through aaaaaaaaaa. But the aaaaa entry of Oct, aa shows that I have ONE (aa) aaaaaaaaaaa issued in my name. Kindly look into the matter and rectify the error as it is effecting my aaaaaaaaaaa.\n\n",
    "intent": "address change process registered",
    "labels": "CC/Card details/Customer details updation/Address Change Process"
  },
  {
    "threadId": "000A9aD0YFC6NKU7",
    "subject": "aaaaaaaaaaaaaaaa:URGENT :TRAVEL CARD NOT LINKING",
    "body": "My travel card aaaa aaaa aaaa aaaa is not linking to my bank account number\naaaaaaaaaaaa. I&#aa;m leaving for aaaaaaaa today evening and need to link it\nurgently. I&#aa;m attaching a screenshot of the same. I have tried both on the\ndesktop version of aaaaaaaaaa website and aaaaaaa app. No reference number\nis being generated. aaaaaaaaaa is attached. Please address this issue asap\nas I&#aa;m leaving today aaaaaaa.\n",
    "intent": "linking process registered",
    "labels": "Internet Banking_Alerts_Credit Limit QK/Internet Banking/Linking_De_linking/Linking process Registered"
  },
  {
    "threadId": "000A9aD1AP571WKT",
    "subject": "aaaaaaaaaaaaaaaa:Enquiry - Mutual Funds",
    "body": "Dear Sir,\n     I am holder of saving bank account in your bank. Please intimate\nwhether I can transact mutual funds  online through my saving account.\n    Hoping for your revert early,aaaaaaaaa,\naaaaaaaaaa,\ne-mail : aaaaaaaaaaaaaaaaaaaaaaaaa\n",
    "intent": "change in email id procedure",
    "labels": "RL/Savings Account/Customer details updation/Email ID change process"
  },
  {
    "threadId": "000A9aD1AP57RQ00",
    "subject": "aaaaaaaaaaaaaaaa:Regarding Grid authentication disabled",
    "body": "Dear Sir,\n\nI was trying to pay my credit card bill through aaaaa internet banking but after filling aaaa values the attached message received. \n\nKindly enable my grid authentication \n\nMY  debit card No aaaa**********aaaa\n\n \n\nWith Regards,\n\n     aaaaaaaaaaaa\n    \n    +aaaaaaaaaaaaa",
    "intent": "alternate channels to apply for debit card",
    "labels": "RL/Deliverables/Debit Card/Alternate channels to apply for a debit card"
  },
  {
    "threadId": "000A9aD0YFC61TKB",
    "subject": "aaaaaaaaaaaaaaaa:level1complaint/Savings Account",
    "body": "Login",
    "intent": "activating internet banking _user id",
    "labels": "IBMBQK/Login/User ID related _ Denial/Activating Internet banking _User ID_"
  },
  {
    "threadId": "000A9aD0KMAXC4H4",
    "subject": "aaaaaaaaaaaaaaaa:Complaint no. aaaaaaaaaaa",
    "body": "\nI want know status of this complaint.\n\nSent from my aaaaaaaaaaaaaa smartphone.",
    "intent": "alternate channels to apply for debit card",
    "labels": "RL/Deliverables/Debit Card/Alternate channels to apply for a debit card"
  },
  {
    "threadId": "000A9aD0YFC6QW6E",
    "subject": "aaaaaaaaaaaaaaaa:Re: Credit card statement",
    "body": "Dear Sir,\n\nYou are requested to not to send me the credit card statement through\ncourier.\nThe statement through mail is sufficient to make the payment.\nPlease do the need full for this month statement also.\n\n\naaaaaaaaaaaaaaaaaaa\naaaaaaaaaa\n",
    "intent": "change of e_mail id registered",
    "labels": "CC/Card details/Customer details updation/Email ID change Process"
  },
  {
    "threadId": "000A9aD1AP57ED6C",
    "subject": "aaaaaaaaaaaaaaaa:I have received credit card statement",
    "body": "Hi Good day,\n\n \n\nI have received  aaa and email saying that about\n\n&quot;We attempted delivery of your aaaaaaaaaaaaaaaaaaaaa for Account aaaaaa viaaaaaaaaaaaaaaaaaaaa, AWB aaaaaaaaaaa on aaaaaaaaa&quot;aaaaaaaaaa have the received from blue dart.\n\n \n\naaaaaaaaaaa; aaaaaaa,\n\n \n\naaaaaaaaaaaaaaaaa \n\n \n\nC +aa aaaa aaa aaa\n\nT +aa aa aaaa aaaa\n\nE aaaaaaaaaaaaaaaaaaaaaaaaaa\n\n \n\n",
    "intent": "address change process registered",
    "labels": "CC/Card details/Customer details updation/Address Change Process"
  },
  {
    "threadId": "000A9aD0KMAXMDB9",
    "subject": "aaaaaaaaaaaaaaaa:level1complaint/Savings Account",
    "body": "\nName: aaaaaaaaaa\nProduct: Savings Account\nAccount No: aaaaaaaaaaaa\nApplication No: \nE-mail address: aaaaaaaaaaaaaaaaaaaaaa\nMobile no: aaaaaaaaaa\nTelephone no: +aaaaaaaaaaaaaaa\nService Request(SR) No:\nDetails of  complaint: aaaaaaaaaaaaaaaa (M.P) Branch&#aa;s Officer talk very rudely and denied to deposit cash and other available facilities.\n",
    "intent": "mobile banking registration",
    "labels": "RL/Savings Account/Customer details updation/Mobile change process"
  },
  {
    "threadId": "000ABaD1WAQS0D86",
    "subject": "aaaaaaaaaaaaaaaa:Address Change Request - A/C : aaaaaaaaaaaa",
    "body": "Team,\n\nThere is the change in my address and that needs to be updated in aaaaaaaaaaaaa. Can you please make the necessary update?\n\nIts not allowing me to update in either aaaaaaaaaa nor in aaaaaaaaaaaaaa\nApp.\n\nYou may call me on registered mobile number for any queries/confirmation.\n\nBelow is aaaaaaaaaaaaaaa\n\n\n\n*Flat No.aaa, ath Floor, aaaaaaaaaaaaaaaa,Beside Ramalayam\nRoad,aaaaaaaaaa,aaaaaaaaaaaaa,aaaaaaaaaaaaaa - aaaaaa*\n\n\nKind Regards,\naaaaaaaaaaaaaaaaaaaa\naaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa: +aaaaaaaaaaaaa\nE-mail: aaaaaaaaaaaaaaaaaaaaaaaaaa\n",
    "intent": "address change process registered",
    "labels": "CC/Card details/Customer details updation/Address Change Process"
  },
  {
    "threadId": "000A9aD0YFC60EPQ",
    "subject": "aaaaaaaaaaaaaaaa:Requesting for NOC",
    "body": "Sir/Madam,\n\nI kindly request you to send me aaa regarding cancellation of my credit card..and the credit card number is aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa from my iPhone\n",
    "intent": "address change process registered",
    "labels": "CC/Card details/Customer details updation/Address Change Process"
  },
  {
    "threadId": "000A9aD1AP571GST",
    "subject": "aaaaaaaaaaaaaaaa:Mobile number update",
    "body": "Icici manager\n\n      Sir my mobile number is not update\nPlease update the my mobile number(aaaaaaaaaaaa) I requested\n",
    "intent": "mobile banking registration",
    "labels": "RL/Savings Account/Customer details updation/Mobile change process"
  },
  {
    "threadId": "000A9aD0KMAXVW09",
    "subject": "aaaaaaaaaaaaaaaa:",
    "body": "SEND MY STATEMENT FOR THIS PAYMENT\n",
    "intent": "change of e_mail id registered",
    "labels": "CC/Card details/Customer details updation/Email ID change Process"
  },
  {
    "threadId": "000A9aD0KMAXK323",
    "subject": "aaaaaaaaaaaaaaaa:level1complaint/Savings Account",
    "body": "\nName: aaaaaaaaaaaaaaaaaaaaaaaaaa: Savings Account\nAccount No: aaaaaaaaaaaa\nApplication No: \nE-mail address: aaaaaaaaaaaaaaaaaa\nMobile no: aaaaaaaaaa\nTelephone no: +aaaaaaaaaaaaaaaaa\nService Request(SR) No:aaaaaaaaa\nDetails of  complaint: The chq no.aaaaaa on aath Nov aaaa issued by me for aaaaaa dishonoured by the bank due to signature mis match. When I enquired the matter with the branch they told me the my signature not available in the system. Kindly look in the matter and rectify the problem.\n",
    "intent": "alternate channels to apply for debit card",
    "labels": "RL/Deliverables/Debit Card/Alternate channels to apply for a debit card"
  },
  {
    "threadId": "000A9aD0YFC662TM",
    "subject": "aaaaaaaaaaaaaaaa:password generation",
    "body": "Dear Sir,\n\nI am in aaaaa for my official seminars and company work. Please cooperate\nto generate password.\n",
    "intent": "activating internet banking _user id",
    "labels": "IBMBQK/Login/User ID related _ Denial/Activating Internet banking _User ID_"
  },
  {
    "threadId": "000A9aD1AP579CGF",
    "subject": "aaaaaaaaaaaaaaaa:aaaaaaaaaaaaaaaa:",
    "body": "cm id:  aaaaaaaaaaaaaaaaaaaa; aaaaarl handled assist with cards.\n \ncm asking about credit card delivery status, kindly do call to cm\n\nNEVER SHARE your Card number, aaa, PIN, aaa, aaaaaaaaaaaaaaaaaaaaaaaa, aaaaaaaa or aaa with anyone, even if the caller claims to be a bank employee. Sharing these details can lead to unauthorised access to your account.\n/\n",
    "intent": "address change process registered",
    "labels": "CC/Card details/Customer details updation/Address Change Process"
  },
  {
    "threadId": "000ABaD1WAQSM5Y1",
    "subject": "aaaaaaaaaaaaaaaa:ATM card fees",
    "body": "Dear Sir/Madam,\n\nI have charged approx. aaa rupees every year as ATM card fees. Kindly\nsuggest another type of ATM card or options to avoid these charges.\n\nThanks\naaaaaa\n",
    "intent": "alternate channels to apply for debit card",
    "labels": "RL/Deliverables/Debit Card/Alternate channels to apply for a debit card"
  },
  {
    "threadId": "000ABaCYDNWYH3ME",
    "subject": "aaaaaaaaaaaaaaaa:Credit card No. aaaaaaaaaaaaaaa",
    "body": "This is with reference to the above aaaaaaaaaaa ICICI aaaaaaaaaaaaaaaaaaa\ncard no. aaaaaaaaaaaaaaa (aaaaaaaaaaaaaaaa).\n\n\nCan it be with aaaa. If yes then kindly change it to aaaaaaaaaaaaaaaaa\naaaaaaaaaaaaaaaaaaaaaaaaaa\n\nRegards,\n\n\n*aaaaaaaaaa*\n",
    "intent": "process of accessing ivr registered/ apin generation",
    "labels": "Card_Pin QK/General Enquiry/IVR access/Process of accessing IVR Registered"
  },
  {
    "threadId": "000A9aD0KMAXUJ2M",
    "subject": "aaaaaaaaaaaaaaaa:Surrender of credit card no : aaaa aaaa aaaa aaaa on Account no: aaaaaaaaaaaaaaaa.",
    "body": "Dear sir/Madam, aaaaaaaaaaaaaaaaaaaa the above mentioned credit card is no more, I would as his daughter request you to discontinue it. I have paid the all amount due to you and hence would like you to do the needful at the earliest.\n\nI would be willing to help you if you require any further information. \n\naaaa regards,aaaaaaaaaaaaaaa.",
    "intent": "change of e_mail id registered",
    "labels": "CC/Card details/Customer details updation/Email ID change Process"
  },
  {
    "threadId": "000ABaD1WAQS1FKN",
    "subject": "aaaaaaaaaaaaaaaa:Regarding for credit card",
    "body": "\n\nSend from my vivo smart phone",
    "intent": "change of mobile number registered",
    "labels": "CC/Card details/Customer details updation/Mobile change process"
  },
  {
    "threadId": "000A9aD0YFC61WAK",
    "subject": "aaaaaaaaaaaaaaaa:Credit card statements",
    "body": "I want credit card statements urgent plz\n",
    "intent": "change of e_mail id registered",
    "labels": "CC/Card details/Customer details updation/Email ID change Process"
  },
  {
    "threadId": "000A9aD0KMAX5BQ4",
    "subject": "aaaaaaaaaaaaaaaa:Final Payment for Credit Card No. aaaa aaaa aaaa aaaa",
    "body": "Sir,\n\nAs per your mail dt. aaaaaaaaaa  I cleared final payment of Rs. aaaaa\n\nFor your aaaaaaaaaaaaaaaaaa is aaaaaaaaaaaaaaaaa.\n\nKindly confirm the receipt of aaaaaaaaaaaaaaaaa and close my aaaaaaaaaaa\nNo. aaaa aaaa aaaa aaaa.\n\n\naaaaaaaa you sir,\n\nThanks and Regards\naaaaaaaaaaaaaaaaa\naaaaaaaaaa\n",
    "intent": "change of e_mail id registered",
    "labels": "CC/Card details/Customer details updation/Email ID change Process"
  },
  {
    "threadId": "000A9aD06HS5V7EU",
    "subject": "aaaaaaaaaaaaaaaa:ATM / Debit Reissue via Velex Courier, AWB aaaaaaaaaa",
    "body": "Hi,\n\nI dont know why they are missing the courier to deliver as i received\ncheque book without any issues last week .I request you to deliver it next\nweek as currently there is no one right now .\n\nContact before delivery : aaaaaaaaaa\n\n\nThanks,aaaaaaaaaaaaa\n",
    "intent": "alternate channels to apply for debit card",
    "labels": "RL/Deliverables/Debit Card/Alternate channels to apply for a debit card"
  },
  {
    "threadId": "000A9aD1AP57WNT3",
    "subject": "aaaaaaaaaaaaaaaa:[Suspected Spam]  Hello",
    "body": "RBI NEW DELHI: VIEW\n\n\nAll e-mail correspondence to and from this address is subject to aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa, which may result in monitoring and disclosure to third parties, including law enforcement. aaaaaaaaaaaaaaaaaaaa/AFFIRMATIVE ACTION EMPLOYER\n",
    "intent": "address change process registered",
    "labels": "CC/Card details/Customer details updation/Address Change Process"
  },
  {
    "threadId": "000ABaD1WAQSMK5P",
    "subject": "aaaaaaaaaaaaaaaa:Statement deliver address change",
    "body": "Hi there,\n\nI moved from the address provided as home in the credit card application.\nCan you please change the credit card deliver address to my office address\n(provided in the application)? Or can you stop sending me printed copy ofaaaaa statement at all? The digital copy you send me through email works\nbetter for me. We can save trees that way :)\n\nThanks,aaaaa\n",
    "intent": "address change process registered",
    "labels": "CC/Card details/Customer details updation/Address Change Process"
  },
  {
    "threadId": "000A9aD0KMAXVCD7",
    "subject": "aaaaaaaaaaaaaaaa:[Caution: Message contains Redirect URL content] Newsletter Mail Marketing Mail It&#39;s true",
    "body": " \nthis is for you. \n\nTrouble reading this email? View it in browser\n[aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa]\n[Best_Offers] aaaaaaaaaaaaaaaa aaaa aaaaaaa. All Rights Reserved. \naaaaaaaaaaa is a product of aaaaaaaaaaaaaaaaaaaaaaaaaaaaa Ltd. aaa, Said Ul\naaaaaa aaaaa, aaaaaaaaa, aaaaa.\nYou are receiving this email because you registered on aaaaaaaaaaa with this\nemail address. [aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa \n To stop receiving aaaaaaa emails\n[aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa Here\n[aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa]\n\n\n\n",
    "intent": "change in email id procedure",
    "labels": "RL/Savings Account/Customer details updation/Email ID change process"
  },
  {
    "threadId": "000ABaCYDNWYYSK8",
    "subject": "aaaaaaaaaaaaaaaa:request for refund of excess payment of aaaaaa incorrectly made to Credit card no. aaaa....aaaa instead of making to another card aaaa....aaaa",
    "body": "Dear SirI have�two credit cards of yr bank namely aaaa....aaaa and aaaa...aaaa. Last month I hv�to deposit aaaaaa against the balance due after auto payment of min due to credit card aaaa.....aaaa which�was paid online�to my another card aaaa....aaaa�by mistake instead of paying it to aaaa....aaaa. This came to my notice when I received SMS�indicating excess payment in the card whereas the interest of aaaa.aa has been claimed on another card which would not have been possible if an incorrect mistake in payment did not happen. I therefore humbly request you kindly look into the matter objectively keeping in view of my long association with your bank for last more than aa years so that I (senior citizen) could not be penalised by paying undue Rs. aaaa.aa. Pl make necessary arrangement to transfer the excess payment lying with my card aaaa...aaaa to my another card aaaa....aaaa and reverse the excess charged interest. Thanking you in anticipation. Thanks.\n(aaaaaaaaaaaaaaaaaa aaaaaaaaaa��\n",
    "intent": "change of mobile number registered",
    "labels": "CC/Card details/Customer details updation/Mobile change process"
  },
  {
    "threadId": "000A9aD1AP57CFDT",
    "subject": "aaaaaaaaaaaaaaaa:Non receipt of monthly statements - Reg.",
    "body": "Dear sirs, So many times, it is being complaining to you for non receipt of monthly statements.� This year also the statements for the months of Jan.,Mar., April May, August, October are not received.� Kindly see the matter of monthly statements be delivered aaaaaaaaaaaaaaaaaaa, I am to inform that there is no change in my present address.� Thanking you sirs.Yours sincerely,aaaaaaaaaaaaaaa,Cr.card no.aaaaaaaaaaaaaaaa.\n\n\n\nSent from aaaaaaaaaa on Android",
    "intent": "change of e_mail id registered",
    "labels": "CC/Card details/Customer details updation/Email ID change Process"
  },
  {
    "threadId": "000ABaD1WAQS0DS7",
    "subject": "aaaaaaaaaaaaaaaa:level1complaint/Savings Account",
    "body": "\nName: aaaaaaaaaaaaaaaaa\nProduct: Savings Account\nAccount No: aaaaaaaaaaaaaaaaaaaaaaaaaa\nE-mail address: aaaaaaaaaaaaaaaaaaaa\nMobile no: aaaaaaaaaa\nTelephone no: +aa--\nService Request(SR) No:\nDetails of  complaint: I have raised a request through online vide subjected number for opening of saving a/c and supposed to contact by a days however no one has contacted me for the same. Please contact me at aaaaaaaaaa.\n",
    "intent": "mobile banking registration",
    "labels": "RL/Savings Account/Customer details updation/Mobile change process"
  },
  {
    "threadId": "000A9aD0KMAXCS1X",
    "subject": "aaaaaaaaaaaaaaaa:Regarding Address",
    "body": "Dear Sir,\nPlease arrange to update my address.\nHerewith attached the address proof with id.\nT/R\naaaaaaaaaaaaaaaaa\n",
    "intent": "address change process registered",
    "labels": "CC/Card details/Customer details updation/Address Change Process"
  }
 ];



function initialize() {

    dataSize = sampleData.length;

    $('footer button').mousedown(function (that) {
        var whichButton = $(that.currentTarget)[0].className;
        actions(whichButton);
        loadItem(ordinal);
    });

    $(document).keydown(function(event) {
        keyed(event.keyCode);
        if (event.keyCode == 8) {
            event.preventDefault();
            event.stopPropagation();
        }
    });

    loadItem(ordinal);
};

function keyed(which) {
    if (which == 65) {$($('footer button')[0]).mousedown()};
    if (which == 88) {$($('footer button')[1]).mousedown()};
    if (which == 32) {$($('footer button')[2]).mousedown()};
    if (which == 8) {$($('footer button')[3]).mousedown()};
};

function actions(which) {
    console.log(which);

    $('footer button.' + which).attr( "data-pressed", "1" );
    setTimeout(function() { $('footer button.' + which).attr( "data-pressed", "0" ); }, 200);

    if (which == 'accept') {
        ordinal++
    };
    if (which == 'reject') {
        ordinal++
    };
    if (which == 'ignore') {
        ordinal++
    };
    if (which == 'undo') {
        ordinal--
    };
    if (ordinal < 0) ordinal = 0;
    if (ordinal > dataSize) ordinal = dataSize;
};

function loadItem(which) {
    $('#datatable').empty();
    var singleItem = sampleData[which];
    
    if (singleItem) {
        $.each(singleItem, function(key, value) {
            $.each(labelsDefault, function(ikey, ivalue) {
                if (key == 'intent') {
                    if (value.toLowerCase() == getLastLabel(ivalue).toLowerCase()) {
                        value += '<br>' + sanitizeLabels(ikey)
                    }
                }
            });
            if (key == 'labels' && value) {
                value = beautifyLabels(value)
            };
            var $tr = $('<tr>').append(
                $('<td class="la">').text(key),
                $('<td class="' + (key == 'intent' || key == 'labels' ? 'field labels' : 'field') + '">').html("<pre>" + value + "</pre>")
            ).appendTo('#datatable');
        });
    }
    else {
        var $tr = $('<tr>').append(
            $('<td class="la">').html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'),
            $('<td class="field">').html("<pre><br><br>Hooray!<br>You're done with this phase. <svg role='img' width=50 height=50 style='vertical-align: middle'><use xmlns:xlink='http://www.w3.org/1999/xlink' xlink:href='#accept'></use></svg></pre>")
        ).appendTo('#datatable');
    };

    $('#prog .vals').text(ordinal + " of " + dataSize + " done");
    $('#progmeter').val(ordinal / dataSize);
};

function getLastLabel(longLabel) {
    longLabel = longLabel.replace(/'/g, "").replace(/ \//g, "/").replace(/\/ /g, "/");
    var longLabelArray = longLabel.split('/');
    return longLabelArray[longLabelArray.length - 1]
}

function getLabels(shortLabel) {
    return labelsDefault[shortLabel] || blank
};

function sanitizeLabels(shortLabel) {
    if (!shortLabel || !shortLabel.length) shortLabel = blank;
    var sampleLabels = getLabels(shortLabel);
    sampleLabels = beautifyLabels(sampleLabels);
    return ("<b>" + shortLabel + '</b><br>' + sampleLabelsUI);
};

function beautifyLabels(sampleLabels) {
    sampleLabels = sampleLabels.replace(/'/g, "").replace(/ \//g, "/").replace(/\/ /g, "/");
    var sampleLabelsArray = sampleLabels.split('/');
    sampleLabelsUI = '<span>' + sampleLabelsArray.join('</span><span>') + '</span>';
    return sampleLabelsUI
};

function query() {
    var dataURL = sigCanvas.toDataURL("image/png");
    postData('', dataURL);
};

function teachNum(that) {
    postData(that, dataURL);
};

function postData (teachNum, dataURL) {
    answerHolder.innerText = "";
    clearCanvas();
    var apiUrl = teachNum.length ? "/train" : "/predict";
    var fd = new FormData();
    fd.append('label', teachNum);
    fd.append('img', dataURL);
    jQuery.ajax({
        type: 'POST',
        url: 'http://192.168.224.238:9000' + apiUrl,
        data: fd,
        processData: false,
        contentType: false
    }).done(function(data) {
        if (!teachNum.length) {
            answerHolder.innerText = data;
        }
    });
};

