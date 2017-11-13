

var partalFlag=true;
var testUrl='https://iservicetest.midea.com:9011/rest/';
//var testUrl='http://10.16.24.83:8080/sit2/';
var formalUrl='https://iservice.midea.com:8080/rest/';
//var formalUrl='http://10.3.8.59:8081/rest/';

var partalConfig=partalFlag?formalUrl:testUrl;
var lanData=[{name:'Bahasa',code:'MPI'},{name:'Spanish',code:'MAC'},{name:'French',code:'MAC'}]

IndonesiaApp
    .constant('getApi',
    {
        //print
        htmltopdfservlet:partalConfig+'htmltopdfservlet?',

        get_do_data_set:partalConfig+'resources/sr/get_do_data_set;',

        //contact us
        getContactUs:partalConfig+'resources/user/get_contact_us;',

        //homepage
        homepage:partalConfig+'resources/workbench/homepage;',
        notification:partalConfig+'resources/workbench/notification;',
        //test profiles
        is_profiles:true,
        login:partalConfig+'resources/login/authentication;',
        loginAuthData:partalConfig+'resources/user/function;',
        logout:partalConfig+'resources/user/logout;',
        leftMenu:partalConfig+'resources/user/function;',
        status:partalConfig+'resources/user/status;',
        //Create customer
        cmLov:partalConfig+'resources/customer/geography;',
        createCustomer:partalConfig+'resources/customer/create;',
        cmList:partalConfig+'resources/customer/summary;',
        cmDetail:partalConfig+'resources/customer/detail;',
        cmUpdate:partalConfig+'resources/customer/update;',
        address_lov:partalConfig+'resources/lov/address_lov;',
        address_code:partalConfig+'resources/lov/address_code_list;',
        verfiy_customer:partalConfig+'resources/customer/verfiy_customer;',
        get_phone_country_code:partalConfig+'resources/customer/get_phone_country_code;',
        get_country:partalConfig+'resources/customer/get_country;',
        get_address_style:partalConfig+'resources/customer/get_address_style;',

        //get_date
        get_date:partalConfig+'resources/lov/get_date;',
        //SR
        get_sr_initial:partalConfig+'resources/sr/get_sr_type;',
        get_sr_init_status:partalConfig+'resources/sr/get_sr_init_status;',
        category:partalConfig+'resources/lov/category;',
        sr_item:partalConfig+'resources/lov/item;',
        owner:partalConfig+'resources/lov/resource;',
        sr_create:partalConfig+'resources/sr/create;',
        sr_summary:partalConfig+'resources/sr/summary;',
        sr_detail:partalConfig+'resources/sr/detail;',
        sr_update:partalConfig+'resources/sr/update;',
        sr_status:partalConfig+'resources/sr/sr_updated_status;',
        problem_code:partalConfig+'resources/lov/problem_code;',
        sr_group:partalConfig+'resources/lov/group;',
        resolution_code:partalConfig+'resources/lov/resolution_code;',
        instance:partalConfig+'resources/lov/instance;',

        //task
        create_task:partalConfig+'resources/task/create;',
        priority:partalConfig+'resources/task/priority;',
        task_resource_type:partalConfig+'resources/task/resource_type;',
        task_resource:partalConfig+'resources/task/resource;',
        task_type:partalConfig+'resources/task/type;',
        task_detail:partalConfig+'resources/task/detail;',
        task_init_status:partalConfig+'resources/task/init_status;',
        task_status:partalConfig+'resources/task/tran_status;',
        task_update:partalConfig+'resources/task/update;',
        task_summary:partalConfig+'resources/task/summary;',
        //charge

        service_activity:partalConfig+'resources/charge/get_service_activity;',
        charge_item:partalConfig+'resources/charge/item;',
        charge_create:partalConfig+'resources/charge/create;',
        charge_detail:partalConfig+'resources/charge/detail;',
        charge_update:partalConfig+'resources/charge/update;',
        charge_reason:partalConfig+'resources/lov/lookup_code;',
        charge_submit_order:partalConfig+'resources/charge/submit_order;',
        charge_summary:partalConfig+'resources/charge/summary;',
        get_subinventory:partalConfig+'resources/charge/get_subinventory;',
        charge_delete:partalConfig+'resources/charge/delete;',
        charge_priceListName:partalConfig+'resources/charge/pricelist_header;',
        charge_price:partalConfig+'resources/charge/pricelist_price;',
        picking_release:partalConfig+'resources/charge/picking_release;',

        //price list
        getHeader:partalConfig+'resources/pricelist/getHeader;',
        getItemDate:partalConfig+'resources/pricelist/getItemNum;',
        getSearchDate:partalConfig+'resources/pricelist/getLines;',
        upPriceDate:partalConfig+'resources/pricelist/updatelines;',
        newPriceDate:partalConfig+'resources/pricelist/createlines;',

        //report
        srReportDate:partalConfig+'resources/rp/srreport;',
        srReportfiledown:partalConfig+'filedown;',
        srReportStates:partalConfig+'resources/sr/get_sr_states_for_rp;',


        //createIB
        create_IB:partalConfig+'resources/ib/create;',
        serial_number:partalConfig+'resources/lov/serial_number;',
        lot_number:partalConfig+'resources/lov/lot_number;',
        installer:partalConfig+'resources/lov/get_installer;',
        technician:partalConfig+'resources/lov/get_tech;',
        summary:partalConfig+'resources/ib/summary;',
        ib_detail:partalConfig+'resources/ib/detail;',
        ib_update:partalConfig+'resources/ib/update;',
        getDefaultInstaller:partalConfig+'resources/ib/getDefaultInstaller;',
        party:partalConfig+'resources/ib/getnewparty;',
        newAddress:partalConfig+'resources/ib/getnewaddress;',
        exchange:partalConfig+'resources/ib/exchange;',
        //file
        file_upload:partalConfig+'fileupload;',
        file_down:partalConfig+'filedown',
        file_delete:partalConfig+'deletefile;',


        //claim
        claimSummary:partalConfig+'resources/claim/getunselectclaimlist;',
        create_Claim:partalConfig+'resources/claim/createclaim;',
        statusType:partalConfig+'resources/claim/getstatus;',
        updateClaim:partalConfig+'resources/claim/getclaimdetail',
        updateClaimheader:partalConfig+'resources/claim/getclaimdetail;',
        getClaimLine:partalConfig+'resources/claim/getclaimline;',
        delClaimline:partalConfig+'resources/claim/deleteclaimline;',
        getclaimheader:partalConfig+'resources/claim/getclaimheader;',
        deleteclaimline:partalConfig+'resources/claim/deleteclaimline;',
        deleteclaim:partalConfig+'resources/claim/deleteclaim;',
        updateclaim:partalConfig+'resources/claim/updateclaim;',
        submitclaim:partalConfig+'resources/claim/submitclaim;',
        getsrtypes:partalConfig+'resources/claim/getsrtypes;',
        getclaimappvhis:partalConfig+'resources/claim/getclaimappvhis;',
        validation_function:partalConfig+'resources/user/validation_function;',

        //Knowledge base
        Knowledge:'https://iservice.midea.com:8000/OA_HTML/ibuhpage.jsp?cux_flag=Y',
        /*Knowledge:'http://zlobssit.midea.com:8001/OA_HTML/fndvald.jsp?',*/
        RecentItems:partalConfig+'resources/workbench/recent_list;',

        //parts
        OnhandInquiry:partalConfig+'resources/sp/asp_stock;',
        OnhandItems:partalConfig+'resources/sp/stock_item_list;',
        TransactionHistory:partalConfig+'resources/sp/asp_trans;',
        Summary:partalConfig+'resources/sp/asp_trans;',
        ReceiveItemList:partalConfig+'resources/sp/receive_item_list;',
        TransType:partalConfig+'resources/sp/trans_type_list;',
        TranxType:partalConfig+'resources/sp/get_tranx_types;',
        ReceiveSp:partalConfig+'resources/sp/receive_sp;',
        SubinvTransferSp:partalConfig+'resources/sp/subinv_transfer;',
        spcategory:partalConfig+'resources/sp/category;',

        //notification
        notification_type:partalConfig+'resources/notification/get_type;',
        notification_create:partalConfig+'resources/notification/create;',
        notification_update:partalConfig+'resources/notification/update;',
        notification_receive_list:partalConfig+'resources/notification/recent;',
        notification_summary:partalConfig+'resources/notification/summary;',
        notification_detail:partalConfig+'resources/notification/detail;',
        n_file_delete:partalConfig+'resources/notification/delete_file;',
        notification_publish:partalConfig+'resources/notification/publish;',

        //parts list
        PLsummaryh:partalConfig+'resources/part/summaryh;',
        PLdetailh:partalConfig+'resources/part/detailh;',
        LastpartList:partalConfig+'resources/part/partList;',
        OrderList:partalConfig+'resources/part/orderList;',
        OrderSpList:partalConfig+'resources/part/shipPartList;',

        //QA
        createQA:partalConfig+'resources/sr/createQA;',
        updateQA:partalConfig+'resources/sr/updateQA;',
        getQALOV:partalConfig+'resources/sr/getQALOV;',
        getQAEng:partalConfig+'resources/sr/getQAEng;',
        getQAdetail:partalConfig+'resources/sr/getQAdetail;',
        deleteQA:partalConfig+'resources/sr/deleteQA;',

        //order
        summaryh:partalConfig+'resources/moveorder/summaryh;',
        s_inventory:partalConfig + 'resources/moveorder/defmvinv;',
        des_inventory:partalConfig + 'resources/moveorder/desmvinv;',
        item_required_lov: partalConfig + 'resources/lov/mvitem;',
        create_order: partalConfig + 'resources/moveorder/createmv;',
        order_num_lov: partalConfig + 'resources/lov/mvreqnum;',
        confirm_order: partalConfig + 'resources/moveorder/confirm;',
        summaryl:partalConfig + 'resources/moveorder/summaryl;',
        detail:partalConfig + 'resources/moveorder/detail;',

        //PO
        create_po:partalConfig + 'resources/po/create;',
        get_location:partalConfig + 'resources/po/get_location;',
        get_use_to:partalConfig + 'resources/po/get_use_to;',
        get_item_list:partalConfig + 'resources/po/get_item_list;',
        get_po_list:partalConfig + 'resources/po/get_po_list;',
        get_po_info:partalConfig + 'resources/po/get_po_info;',
        update_po:partalConfig + 'resources/po/update;',
        get_po_states:partalConfig + 'resources/po/get_po_states;',
        update_party_site_use:partalConfig + 'resources/po/update_party_site_use;',
        create_party_site_use:partalConfig + 'resources/po/create_party_site_use;',
        receive_po:partalConfig + 'resources/po/receive_po;',



        //to pdf
        topdf:partalConfig + 'resources/part/userkey;',
        //location
        location:partalConfig + 'resources/charge/get_location;',
        get_item_onhand:partalConfig + 'resources/sp/get_item_onhand;',
        update_locator:partalConfig + 'resources/sp/update_locator;',
        create_locator:partalConfig + 'resources/sp/create_locator;'
    }
);
