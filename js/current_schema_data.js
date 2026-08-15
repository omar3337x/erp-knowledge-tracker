/**
 * js/current_schema_data.js
 * 🗄️ Pre-Parsed Schema Map of Current Database (Source of Truth: newdatabase2026.sql)
 * Generated on: 2026-08-15T20:24:55.232Z
 */
const CURRENT_DATABASE_SCHEMA = {
  "database": "newdatabase2026",
  "generated_at": "2026-08-15T20:24:55.232Z",
  "total_tables": 406,
  "total_views": 0,
  "tables": {
    "accounting": {
      "name": "accounting",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "paid_type": {
          "name": "paid_type",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "bill_id": {
          "name": "bill_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "bol": {
          "name": "bol",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "payment_type": {
          "name": "payment_type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "opening_bill_id": {
          "name": "opening_bill_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "cash_type": {
          "name": "cash_type",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "paid_in_bill": {
          "name": "paid_in_bill",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "collection_no": {
          "name": "collection_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "enter_in_delegate_account": {
          "name": "enter_in_delegate_account",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "userid": {
          "name": "userid",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "cash_id": {
          "name": "cash_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "attachment": {
          "name": "attachment",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "is_taxable": {
          "name": "is_taxable",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "commission": {
          "name": "commission",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_on_commission": {
          "name": "tax_on_commission",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "cycle_id": {
          "name": "cycle_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "grouped_cash_receipt_id": {
          "name": "grouped_cash_receipt_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "cost_center_tag_id": {
          "name": "cost_center_tag_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "rent_from_date": {
          "name": "rent_from_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "rent_to_date": {
          "name": "rent_to_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "salary_month": {
          "name": "salary_month",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "discount_gl_account_type_id": {
          "name": "discount_gl_account_type_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "broker_id": {
          "name": "broker_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "receipt_type": {
          "name": "receipt_type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "approved": {
          "name": "approved",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "is_commission_tax_inclusive": {
          "name": "is_commission_tax_inclusive",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "accounting_2025": {
      "name": "accounting_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "paid_type": {
          "name": "paid_type",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "bill_id": {
          "name": "bill_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "bol": {
          "name": "bol",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "payment_type": {
          "name": "payment_type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "opening_bill_id": {
          "name": "opening_bill_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "cash_type": {
          "name": "cash_type",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "paid_in_bill": {
          "name": "paid_in_bill",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "collection_no": {
          "name": "collection_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "enter_in_delegate_account": {
          "name": "enter_in_delegate_account",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "userid": {
          "name": "userid",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "cash_id": {
          "name": "cash_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "attachment": {
          "name": "attachment",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "is_taxable": {
          "name": "is_taxable",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "commission": {
          "name": "commission",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_on_commission": {
          "name": "tax_on_commission",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "cycle_id": {
          "name": "cycle_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "grouped_cash_receipt_id": {
          "name": "grouped_cash_receipt_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "cost_center_tag_id": {
          "name": "cost_center_tag_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "rent_from_date": {
          "name": "rent_from_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "rent_to_date": {
          "name": "rent_to_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "salary_month": {
          "name": "salary_month",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "discount_gl_account_type_id": {
          "name": "discount_gl_account_type_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "receipt_type": {
          "name": "receipt_type",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "broker_id": {
          "name": "broker_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "approved": {
          "name": "approved",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "is_commission_tax_inclusive": {
          "name": "is_commission_tax_inclusive",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "accounting_filter_report_rolls": {
      "name": "accounting_filter_report_rolls",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "user_id": {
          "name": "user_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "report_columns_id": {
          "name": "report_columns_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "accounting_report_columns": {
      "name": "accounting_report_columns",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "column_name": {
          "name": "column_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "report_key": {
          "name": "report_key",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "name_en": {
          "name": "name_en",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "name_ar": {
          "name": "name_ar",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "accounts_groups": {
      "name": "accounts_groups",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "account_id": {
          "name": "account_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "group_id": {
          "name": "group_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "accounts_tags": {
      "name": "accounts_tags",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "account_id": {
          "name": "account_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "tag_id": {
          "name": "tag_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "account_groups": {
      "name": "account_groups",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "account_tags": {
      "name": "account_tags",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(30)",
          "nullable": false,
          "autoIncrement": false
        },
        "description": {
          "name": "description",
          "type": "varchar(60)",
          "nullable": true,
          "autoIncrement": false
        },
        "inactive": {
          "name": "inactive",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "category_id": {
          "name": "category_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "account_tag_category": {
      "name": "account_tag_category",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "description": {
          "name": "description",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "cost_center_serial": {
          "name": "cost_center_serial",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "parent_id": {
          "name": "parent_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "additional_cost": {
      "name": "additional_cost",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "add_cost_name": {
          "name": "add_cost_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "account_id": {
          "name": "account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "credit_account_id": {
          "name": "credit_account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "alternates": {
      "name": "alternates",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "casher_id": {
          "name": "casher_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "oppening_amount": {
          "name": "oppening_amount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "from_date": {
          "name": "from_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "from_time": {
          "name": "from_time",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "to_date": {
          "name": "to_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "to_time": {
          "name": "to_time",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "assets": {
      "name": "assets",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "description": {
          "name": "description",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "image": {
          "name": "image",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "cat_id": {
          "name": "cat_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "sub_cat_id": {
          "name": "sub_cat_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "taxasset_id": {
          "name": "taxasset_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_measure_id": {
          "name": "unit_measure_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "deprecaton_method_id": {
          "name": "deprecaton_method_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "deprecation_start_date": {
          "name": "deprecation_start_date",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "asset_users": {
      "name": "asset_users",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "remember_token": {
          "name": "remember_token",
          "type": "varchar(100)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(60)",
          "nullable": false,
          "autoIncrement": false
        },
        "password": {
          "name": "password",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "real_name": {
          "name": "real_name",
          "type": "varchar(100)",
          "nullable": true,
          "autoIncrement": false
        },
        "phone": {
          "name": "phone",
          "type": "varchar(30)",
          "nullable": true,
          "autoIncrement": false
        },
        "email": {
          "name": "email",
          "type": "varchar(100)",
          "nullable": true,
          "autoIncrement": false
        },
        "language": {
          "name": "language",
          "type": "varchar(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "group_id": {
          "name": "group_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "level": {
          "name": "level",
          "type": "enum('Fulladmin','user')",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "attachments": {
      "name": "attachments",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "slug": {
          "name": "slug",
          "type": "varchar(60)",
          "nullable": false,
          "autoIncrement": false
        },
        "reference_id": {
          "name": "reference_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "trans_no": {
          "name": "trans_no",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "unique_name": {
          "name": "unique_name",
          "type": "varchar(60)",
          "nullable": false,
          "autoIncrement": false
        },
        "tran_date": {
          "name": "tran_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "filename": {
          "name": "filename",
          "type": "varchar(60)",
          "nullable": false,
          "autoIncrement": false
        },
        "filesize": {
          "name": "filesize",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "filetype": {
          "name": "filetype",
          "type": "varchar(60)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "attachments_2025": {
      "name": "attachments_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "slug": {
          "name": "slug",
          "type": "varchar(60)",
          "nullable": false,
          "autoIncrement": false
        },
        "reference_id": {
          "name": "reference_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "trans_no": {
          "name": "trans_no",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "unique_name": {
          "name": "unique_name",
          "type": "varchar(60)",
          "nullable": false,
          "autoIncrement": false
        },
        "tran_date": {
          "name": "tran_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "filename": {
          "name": "filename",
          "type": "varchar(60)",
          "nullable": false,
          "autoIncrement": false
        },
        "filesize": {
          "name": "filesize",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "filetype": {
          "name": "filetype",
          "type": "varchar(60)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "audit_trail": {
      "name": "audit_trail",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "type_id": {
          "name": "type_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "type_no": {
          "name": "type_no",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "gl_date": {
          "name": "gl_date",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        },
        "user_id": {
          "name": "user_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "description": {
          "name": "description",
          "type": "varchar(60)",
          "nullable": true,
          "autoIncrement": false
        },
        "fiscal_year_id": {
          "name": "fiscal_year_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_seq": {
          "name": "gl_seq",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "a_customers": {
      "name": "a_customers",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name_en": {
          "name": "name_en",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "name_ar": {
          "name": "name_ar",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "address": {
          "name": "address",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_number": {
          "name": "tax_number",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "account_id": {
          "name": "account_id",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "phone": {
          "name": "phone",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "email": {
          "name": "email",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "comerical_register": {
          "name": "comerical_register",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "postal_code": {
          "name": "postal_code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "city_id": {
          "name": "city_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "a_logs": {
      "name": "a_logs",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "user_id": {
          "name": "user_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "loggable_id": {
          "name": "loggable_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "loggable_type": {
          "name": "loggable_type",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "action": {
          "name": "action",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "user_name": {
          "name": "user_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "reference": {
          "name": "reference",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "a_logs_2025": {
      "name": "a_logs_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "user_id": {
          "name": "user_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "loggable_id": {
          "name": "loggable_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "loggable_type": {
          "name": "loggable_type",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "action": {
          "name": "action",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "user_name": {
          "name": "user_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "reference": {
          "name": "reference",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "a_users": {
      "name": "a_users",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "remember_token": {
          "name": "remember_token",
          "type": "varchar(100)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(60)",
          "nullable": false,
          "autoIncrement": false
        },
        "password": {
          "name": "password",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "real_name": {
          "name": "real_name",
          "type": "varchar(100)",
          "nullable": true,
          "autoIncrement": false
        },
        "role_id": {
          "name": "role_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "phone": {
          "name": "phone",
          "type": "varchar(30)",
          "nullable": true,
          "autoIncrement": false
        },
        "email": {
          "name": "email",
          "type": "varchar(100)",
          "nullable": true,
          "autoIncrement": false
        },
        "language": {
          "name": "language",
          "type": "varchar(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "managed_geographic_section_id": {
          "name": "managed_geographic_section_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "accounted_geographic_section_id": {
          "name": "accounted_geographic_section_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "access_previous_years": {
          "name": "access_previous_years",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "logo": {
          "name": "logo",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "custody_account": {
          "name": "custody_account",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "active": {
          "name": "active",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "blocked_branches": {
          "name": "blocked_branches",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "banktemp": {
      "name": "banktemp",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(255)",
          "nullable": false,
          "autoIncrement": false
        },
        "credit": {
          "name": "credit",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "debit": {
          "name": "debit",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "bank": {
          "name": "bank",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "varchar(255)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "bank_accounts": {
      "name": "bank_accounts",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "account_type_id": {
          "name": "account_type_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "bank_account_name": {
          "name": "bank_account_name",
          "type": "varchar(60)",
          "nullable": false,
          "autoIncrement": false
        },
        "bank_account_number": {
          "name": "bank_account_number",
          "type": "varchar(100)",
          "nullable": true,
          "autoIncrement": false
        },
        "bank_name": {
          "name": "bank_name",
          "type": "varchar(60)",
          "nullable": true,
          "autoIncrement": false
        },
        "bank_address": {
          "name": "bank_address",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "currency_id": {
          "name": "currency_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "is_dflt_curr_account": {
          "name": "is_dflt_curr_account",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "bank_charges_account_id": {
          "name": "bank_charges_account_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "last_reconciled_date": {
          "name": "last_reconciled_date",
          "type": "datetime",
          "nullable": true,
          "autoIncrement": false
        },
        "ending_reconcile_balance": {
          "name": "ending_reconcile_balance",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "inactive": {
          "name": "inactive",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "bank_account_types": {
      "name": "bank_account_types",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "slug": {
          "name": "slug",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "transaction_name_en": {
          "name": "transaction_name_en",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "transaction_name_ar": {
          "name": "transaction_name_ar",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "account_name_en": {
          "name": "account_name_en",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "account_name_ar": {
          "name": "account_name_ar",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "bank_journal_trans": {
      "name": "bank_journal_trans",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "deleted_at": {
          "name": "deleted_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "type_id": {
          "name": "type_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "trans_no": {
          "name": "trans_no",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "trans_date": {
          "name": "trans_date",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        },
        "reference": {
          "name": "reference",
          "type": "varchar(60)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "memo": {
          "name": "memo",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "exchange_rate": {
          "name": "exchange_rate",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "person_type_id": {
          "name": "person_type_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "person_id": {
          "name": "person_id",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "user_id": {
          "name": "user_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "is_closed": {
          "name": "is_closed",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "bank_journal_trans_2025": {
      "name": "bank_journal_trans_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "deleted_at": {
          "name": "deleted_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "type_id": {
          "name": "type_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "trans_no": {
          "name": "trans_no",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "trans_date": {
          "name": "trans_date",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        },
        "reference": {
          "name": "reference",
          "type": "varchar(60)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "memo": {
          "name": "memo",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "exchange_rate": {
          "name": "exchange_rate",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "person_type_id": {
          "name": "person_type_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "person_id": {
          "name": "person_id",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "user_id": {
          "name": "user_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "is_closed": {
          "name": "is_closed",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "bank_trans": {
      "name": "bank_trans",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "deleted_at": {
          "name": "deleted_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "type_id": {
          "name": "type_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "type_no": {
          "name": "type_no",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "bank_account_id": {
          "name": "bank_account_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "ref": {
          "name": "ref",
          "type": "varchar(40)",
          "nullable": true,
          "autoIncrement": false
        },
        "trans_date": {
          "name": "trans_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "dimension_id": {
          "name": "dimension_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "dimension2_id": {
          "name": "dimension2_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "person_type_id": {
          "name": "person_type_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "person_id": {
          "name": "person_id",
          "type": "blob",
          "nullable": true,
          "autoIncrement": false
        },
        "memo": {
          "name": "memo",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "reconciled": {
          "name": "reconciled",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "bank_trans_2025": {
      "name": "bank_trans_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "deleted_at": {
          "name": "deleted_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "type_id": {
          "name": "type_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "type_no": {
          "name": "type_no",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "bank_account_id": {
          "name": "bank_account_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "ref": {
          "name": "ref",
          "type": "varchar(40)",
          "nullable": true,
          "autoIncrement": false
        },
        "trans_date": {
          "name": "trans_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "dimension_id": {
          "name": "dimension_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "dimension2_id": {
          "name": "dimension2_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "person_type_id": {
          "name": "person_type_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "person_id": {
          "name": "person_id",
          "type": "blob",
          "nullable": true,
          "autoIncrement": false
        },
        "memo": {
          "name": "memo",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "reconciled": {
          "name": "reconciled",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "bills": {
      "name": "bills",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "broker_id": {
          "name": "broker_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "bol": {
          "name": "bol",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount": {
          "name": "discount",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_type": {
          "name": "discount_type",
          "type": "varchar(50)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "varchar(50)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "paid": {
          "name": "paid",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "remain": {
          "name": "remain",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "cost_center_id": {
          "name": "cost_center_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "check_supply": {
          "name": "check_supply",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_offers": {
          "name": "discount_offers",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "ref_number": {
          "name": "ref_number",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "casher_id": {
          "name": "casher_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "netProfit": {
          "name": "netProfit",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "item_discount": {
          "name": "item_discount",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "approved": {
          "name": "approved",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "zatca_status": {
          "name": "zatca_status",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "zatca_message": {
          "name": "zatca_message",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "uuid": {
          "name": "uuid",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_hash": {
          "name": "invoice_hash",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "signing_time": {
          "name": "signing_time",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "sent_to_zatca": {
          "name": "sent_to_zatca",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "QrCode": {
          "name": "QrCode",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "zatca_error": {
          "name": "zatca_error",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "shipping_date": {
          "name": "shipping_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "shipping_number": {
          "name": "shipping_number",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "commission_percentage": {
          "name": "commission_percentage",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "commission_value": {
          "name": "commission_value",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "delivery_cost": {
          "name": "delivery_cost",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_by": {
          "name": "created_by",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "bill_sequence": {
          "name": "bill_sequence",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "bill_classification": {
          "name": "bill_classification",
          "type": "tinyint(3)",
          "nullable": true,
          "autoIncrement": false
        },
        "contract_invoice_id": {
          "name": "contract_invoice_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "bills_2025": {
      "name": "bills_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "bol": {
          "name": "bol",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "discount": {
          "name": "discount",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_type": {
          "name": "discount_type",
          "type": "varchar(50)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "varchar(50)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "paid": {
          "name": "paid",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "remain": {
          "name": "remain",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "cost_center_id": {
          "name": "cost_center_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "check_supply": {
          "name": "check_supply",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_offers": {
          "name": "discount_offers",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "ref_number": {
          "name": "ref_number",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "casher_id": {
          "name": "casher_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "netProfit": {
          "name": "netProfit",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "item_discount": {
          "name": "item_discount",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "approved": {
          "name": "approved",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "zatca_status": {
          "name": "zatca_status",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "zatca_message": {
          "name": "zatca_message",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "uuid": {
          "name": "uuid",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_hash": {
          "name": "invoice_hash",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "signing_time": {
          "name": "signing_time",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "sent_to_zatca": {
          "name": "sent_to_zatca",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "QrCode": {
          "name": "QrCode",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "zatca_error": {
          "name": "zatca_error",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "shipping_date": {
          "name": "shipping_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "shipping_number": {
          "name": "shipping_number",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "broker_id": {
          "name": "broker_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "commission_percentage": {
          "name": "commission_percentage",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "commission_value": {
          "name": "commission_value",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "delivery_cost": {
          "name": "delivery_cost",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_by": {
          "name": "created_by",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "bill_sequence": {
          "name": "bill_sequence",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "bill_classification": {
          "name": "bill_classification",
          "type": "tinyint(3)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "bills_details_pending": {
      "name": "bills_details_pending",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "bill_id": {
          "name": "bill_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "total_price": {
          "name": "total_price",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_price": {
          "name": "unit_price",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(1000)",
          "nullable": false,
          "autoIncrement": false
        },
        "expire_date": {
          "name": "expire_date",
          "type": "varchar(50)",
          "nullable": true,
          "autoIncrement": false
        },
        "discount_quantity": {
          "name": "discount_quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "item_discount_value": {
          "name": "item_discount_value",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "bills_details_pending_2025": {
      "name": "bills_details_pending_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "bill_id": {
          "name": "bill_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "total_price": {
          "name": "total_price",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_price": {
          "name": "unit_price",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(1000)",
          "nullable": false,
          "autoIncrement": false
        },
        "expire_date": {
          "name": "expire_date",
          "type": "varchar(50)",
          "nullable": true,
          "autoIncrement": false
        },
        "discount_quantity": {
          "name": "discount_quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "item_discount_value": {
          "name": "item_discount_value",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "bills_pending": {
      "name": "bills_pending",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "bol": {
          "name": "bol",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount": {
          "name": "discount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_type": {
          "name": "discount_type",
          "type": "varchar(50)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "varchar(50)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "paid": {
          "name": "paid",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "remain": {
          "name": "remain",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "check_supply": {
          "name": "check_supply",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_offers": {
          "name": "discount_offers",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "ref_number": {
          "name": "ref_number",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "casher_id": {
          "name": "casher_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "bills_pending_2025": {
      "name": "bills_pending_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "bol": {
          "name": "bol",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount": {
          "name": "discount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_type": {
          "name": "discount_type",
          "type": "varchar(50)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "varchar(50)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "paid": {
          "name": "paid",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "remain": {
          "name": "remain",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "check_supply": {
          "name": "check_supply",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_offers": {
          "name": "discount_offers",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "ref_number": {
          "name": "ref_number",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "casher_id": {
          "name": "casher_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "bills_returned": {
      "name": "bills_returned",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "broker_id": {
          "name": "broker_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "bol": {
          "name": "bol",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount": {
          "name": "discount",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_type": {
          "name": "discount_type",
          "type": "varchar(50)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "varchar(50)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "paid": {
          "name": "paid",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "remain": {
          "name": "remain",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "check_supply": {
          "name": "check_supply",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_offers": {
          "name": "discount_offers",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "valid_bill_id": {
          "name": "valid_bill_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "casher_id": {
          "name": "casher_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "item_discount": {
          "name": "item_discount",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "return_year": {
          "name": "return_year",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "zatca_status": {
          "name": "zatca_status",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "zatca_message": {
          "name": "zatca_message",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "uuid": {
          "name": "uuid",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_hash": {
          "name": "invoice_hash",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "signing_time": {
          "name": "signing_time",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "xml": {
          "name": "xml",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "sent_to_zatca": {
          "name": "sent_to_zatca",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "QrCode": {
          "name": "QrCode",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "zatca_error": {
          "name": "zatca_error",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "created_by": {
          "name": "created_by",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "bills_returned_2025": {
      "name": "bills_returned_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "bol": {
          "name": "bol",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "discount": {
          "name": "discount",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_type": {
          "name": "discount_type",
          "type": "varchar(50)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "varchar(50)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "paid": {
          "name": "paid",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "remain": {
          "name": "remain",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "check_supply": {
          "name": "check_supply",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_offers": {
          "name": "discount_offers",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "valid_bill_id": {
          "name": "valid_bill_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "casher_id": {
          "name": "casher_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "item_discount": {
          "name": "item_discount",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "return_year": {
          "name": "return_year",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "zatca_status": {
          "name": "zatca_status",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "zatca_message": {
          "name": "zatca_message",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "uuid": {
          "name": "uuid",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_hash": {
          "name": "invoice_hash",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "signing_time": {
          "name": "signing_time",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "xml": {
          "name": "xml",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "sent_to_zatca": {
          "name": "sent_to_zatca",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "QrCode": {
          "name": "QrCode",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "zatca_error": {
          "name": "zatca_error",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "broker_id": {
          "name": "broker_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_by": {
          "name": "created_by",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "bill_clothes_details": {
      "name": "bill_clothes_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "bill_details_id": {
          "name": "bill_details_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "color_id": {
          "name": "color_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "size_id": {
          "name": "size_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "bill_details": {
      "name": "bill_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "bill_id": {
          "name": "bill_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "total_price": {
          "name": "total_price",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_price": {
          "name": "unit_price",
          "type": "decimal(24,12)",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(255)",
          "nullable": false,
          "autoIncrement": false
        },
        "expire_date": {
          "name": "expire_date",
          "type": "varchar(50)",
          "nullable": true,
          "autoIncrement": false
        },
        "production_date": {
          "name": "production_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "discount_quantity": {
          "name": "discount_quantity",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "item_discount_value": {
          "name": "item_discount_value",
          "type": "decimal(24,12)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "components": {
          "name": "components",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "pieces_count": {
          "name": "pieces_count",
          "type": "decimal(15,3)",
          "nullable": true,
          "autoIncrement": false
        },
        "contract_invoice_item_id": {
          "name": "contract_invoice_item_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "bill_details_2025": {
      "name": "bill_details_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "bill_id": {
          "name": "bill_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "total_price": {
          "name": "total_price",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_price": {
          "name": "unit_price",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(255)",
          "nullable": false,
          "autoIncrement": false
        },
        "expire_date": {
          "name": "expire_date",
          "type": "varchar(50)",
          "nullable": true,
          "autoIncrement": false
        },
        "production_date": {
          "name": "production_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "discount_quantity": {
          "name": "discount_quantity",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "item_discount_value": {
          "name": "item_discount_value",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "components": {
          "name": "components",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "pieces_count": {
          "name": "pieces_count",
          "type": "decimal(15,3)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "bill_details_returned": {
      "name": "bill_details_returned",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "bill_id": {
          "name": "bill_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "total_price": {
          "name": "total_price",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_price": {
          "name": "unit_price",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(255)",
          "nullable": false,
          "autoIncrement": false
        },
        "expire_date": {
          "name": "expire_date",
          "type": "varchar(50)",
          "nullable": true,
          "autoIncrement": false
        },
        "production_date": {
          "name": "production_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "item_discount_value": {
          "name": "item_discount_value",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_quantity": {
          "name": "discount_quantity",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "components": {
          "name": "components",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "pieces_count": {
          "name": "pieces_count",
          "type": "decimal(15,3)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "bill_details_returned_2025": {
      "name": "bill_details_returned_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "bill_id": {
          "name": "bill_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "total_price": {
          "name": "total_price",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_price": {
          "name": "unit_price",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(255)",
          "nullable": false,
          "autoIncrement": false
        },
        "expire_date": {
          "name": "expire_date",
          "type": "varchar(50)",
          "nullable": true,
          "autoIncrement": false
        },
        "production_date": {
          "name": "production_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "item_discount_value": {
          "name": "item_discount_value",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_quantity": {
          "name": "discount_quantity",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "components": {
          "name": "components",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "pieces_count": {
          "name": "pieces_count",
          "type": "decimal(15,3)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "branches": {
      "name": "branches",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "latitude": {
          "name": "latitude",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "longitude": {
          "name": "longitude",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "region_id": {
          "name": "region_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "city_id": {
          "name": "city_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "map_address": {
          "name": "map_address",
          "type": "varchar(100)",
          "nullable": true,
          "autoIncrement": false
        },
        "accounting_branch_id": {
          "name": "accounting_branch_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_box_gl_account_id": {
          "name": "branch_box_gl_account_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "paymentmethod_id": {
          "name": "paymentmethod_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "company_id": {
          "name": "company_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "limit": {
          "name": "limit",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "name_en": {
          "name": "name_en",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "budget_trans": {
      "name": "budget_trans",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "trans_date": {
          "name": "trans_date",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        },
        "account_id": {
          "name": "account_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "dimension_id": {
          "name": "dimension_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "dimension2_id": {
          "name": "dimension2_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "year": {
          "name": "year",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "cashers": {
      "name": "cashers",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "default_customer": {
          "name": "default_customer",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "cash_receipt_details": {
      "name": "cash_receipt_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "cash_receipt_id": {
          "name": "cash_receipt_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "bill_id": {
          "name": "bill_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "paid_amount": {
          "name": "paid_amount",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "remain": {
          "name": "remain",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "cash_receipt_details_2025": {
      "name": "cash_receipt_details_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "cash_receipt_id": {
          "name": "cash_receipt_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "bill_id": {
          "name": "bill_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "paid_amount": {
          "name": "paid_amount",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "remain": {
          "name": "remain",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "categories": {
      "name": "categories",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(200)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "category_classification": {
          "name": "category_classification",
          "type": "tinyint(4)",
          "nullable": true,
          "autoIncrement": false
        },
        "parent_id": {
          "name": "parent_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "dont_allow_return": {
          "name": "dont_allow_return",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "cost_center_id": {
          "name": "cost_center_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "icon": {
          "name": "icon",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "print_name": {
          "name": "print_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "categoryassests": {
      "name": "categoryassests",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name_en": {
          "name": "name_en",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "name_ar": {
          "name": "name_ar",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "profit_asset": {
          "name": "profit_asset",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "assets_account": {
          "name": "assets_account",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "depreciation_complex_account": {
          "name": "depreciation_complex_account",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "depreciation_expense_account": {
          "name": "depreciation_expense_account",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "change_accounts": {
      "name": "change_accounts",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "from_account": {
          "name": "from_account",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "from_account_name": {
          "name": "from_account_name",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "to_account": {
          "name": "to_account",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "start_date": {
          "name": "start_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "end_date": {
          "name": "end_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "memo": {
          "name": "memo",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "chartmasterpermissions": {
      "name": "chartmasterpermissions",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "role_id": {
          "name": "role_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "chartmaster_id": {
          "name": "chartmaster_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "chart_class": {
      "name": "chart_class",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "cid": {
          "name": "cid",
          "type": "varchar(3)",
          "nullable": false,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(120)",
          "nullable": false,
          "autoIncrement": false
        },
        "ctype": {
          "name": "ctype",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "inactive": {
          "name": "inactive",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "chart_class_categories": {
      "name": "chart_class_categories",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "slug": {
          "name": "slug",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "chart_master": {
      "name": "chart_master",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "account_code": {
          "name": "account_code",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "account_code2": {
          "name": "account_code2",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "account_name": {
          "name": "account_name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "account_type": {
          "name": "account_type",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "inactive": {
          "name": "inactive",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "is_frozen": {
          "name": "is_frozen",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "accountable_id": {
          "name": "accountable_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "accountable_type": {
          "name": "accountable_type",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "archived_year": {
          "name": "archived_year",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "without_permission": {
          "name": "without_permission",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "account_name_en": {
          "name": "account_name_en",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "chart_type": {
          "name": "chart_type",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "currency_id": {
          "name": "currency_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "DebitType": {
          "name": "DebitType",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "follow_up": {
          "name": "follow_up",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "activity_type": {
          "name": "activity_type",
          "type": "enum('Operating','Investing','Financing','Non')",
          "nullable": false,
          "autoIncrement": false
        },
        "cost_type": {
          "name": "cost_type",
          "type": "enum('Fixed','Variable','Non')",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "chart_types": {
      "name": "chart_types",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "tid": {
          "name": "tid",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "class_id": {
          "name": "class_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "parent_id": {
          "name": "parent_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "inactive": {
          "name": "inactive",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "level": {
          "name": "level",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "cheques": {
      "name": "cheques",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "cheque_id": {
          "name": "cheque_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "bank_id": {
          "name": "bank_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "due_date": {
          "name": "due_date",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "Collection_date": {
          "name": "Collection_date",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "status_date": {
          "name": "status_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "refuse_reason": {
          "name": "refuse_reason",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "cheques_2025": {
      "name": "cheques_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "cheque_id": {
          "name": "cheque_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "bank_id": {
          "name": "bank_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "due_date": {
          "name": "due_date",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "Collection_date": {
          "name": "Collection_date",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "status_date": {
          "name": "status_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "refuse_reason": {
          "name": "refuse_reason",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "claims": {
      "name": "claims",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "project_id": {
          "name": "project_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "stage_id": {
          "name": "stage_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "account_id": {
          "name": "account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "indebtedness": {
          "name": "indebtedness",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "claim_value": {
          "name": "claim_value",
          "type": "decimal(10,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "currency_id": {
          "name": "currency_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "decimal(10,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "decimal(10,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "due_date": {
          "name": "due_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "description": {
          "name": "description",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_percentage": {
          "name": "tax_percentage",
          "type": "decimal(10,4)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "close_years": {
      "name": "close_years",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "begin": {
          "name": "begin",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        },
        "end": {
          "name": "end",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        },
        "is_closed": {
          "name": "is_closed",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "close_year_setting": {
      "name": "close_year_setting",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "key": {
          "name": "key",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "value": {
          "name": "value",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "clothes_barcode": {
      "name": "clothes_barcode",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "color": {
          "name": "color",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "barcode": {
          "name": "barcode",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "collectionexcel": {
      "name": "collectionexcel",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "header_h_detail_d": {
          "name": "header_h_detail_d",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "customer_code": {
          "name": "customer_code",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "collection_id": {
          "name": "collection_id",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "cash_amount": {
          "name": "cash_amount",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "cheque_amount": {
          "name": "cheque_amount",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "bank_transfer_amount": {
          "name": "bank_transfer_amount",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "total_collection_amount": {
          "name": "total_collection_amount",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "settlement_amount": {
          "name": "settlement_amount",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "companies": {
      "name": "companies",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "office_name": {
          "name": "office_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "address": {
          "name": "address",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_number": {
          "name": "tax_number",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "first_logo": {
          "name": "first_logo",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "second_logo": {
          "name": "second_logo",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "iban": {
          "name": "iban",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "commercial_record": {
          "name": "commercial_record",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "category_id": {
          "name": "category_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "office_phone": {
          "name": "office_phone",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "streetname": {
          "name": "streetname",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "BuildingNumber": {
          "name": "BuildingNumber",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "plot_identification": {
          "name": "plot_identification",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "CitySubdivisionName": {
          "name": "CitySubdivisionName",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "CityName": {
          "name": "CityName",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "PostalZone": {
          "name": "PostalZone",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "office_email": {
          "name": "office_email",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "company_zatca_config": {
      "name": "company_zatca_config",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "company_id": {
          "name": "company_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "key": {
          "name": "key",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "value": {
          "name": "value",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "contact_us": {
      "name": "contact_us",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "user_id": {
          "name": "user_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(50)",
          "nullable": false,
          "autoIncrement": false
        },
        "phone": {
          "name": "phone",
          "type": "varchar(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "email": {
          "name": "email",
          "type": "varchar(50)",
          "nullable": false,
          "autoIncrement": false
        },
        "subject": {
          "name": "subject",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "content": {
          "name": "content",
          "type": "varchar(200)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "contract_invoices": {
      "name": "contract_invoices",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "submission_token": {
          "name": "submission_token",
          "type": "char(36)",
          "nullable": true,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost_center_id": {
          "name": "cost_center_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "contract_number": {
          "name": "contract_number",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "supply_date": {
          "name": "supply_date",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "contractor_number": {
          "name": "contractor_number",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "customer_snapshot": {
          "name": "customer_snapshot",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_rate": {
          "name": "tax_rate",
          "type": "decimal(7,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "subtotal": {
          "name": "subtotal",
          "type": "decimal(18,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_total": {
          "name": "discount_total",
          "type": "decimal(18,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "taxable_total": {
          "name": "taxable_total",
          "type": "decimal(18,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_total": {
          "name": "tax_total",
          "type": "decimal(18,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "decimal(18,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "paid": {
          "name": "paid",
          "type": "decimal(18,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "payment_details": {
          "name": "payment_details",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "varchar(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "posted_bill_id": {
          "name": "posted_bill_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "posted_bill_year": {
          "name": "posted_bill_year",
          "type": "smallint(5)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_by": {
          "name": "created_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "approved_by": {
          "name": "approved_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "approved_at": {
          "name": "approved_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "contract_invoice_items": {
      "name": "contract_invoice_items",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "contract_invoice_id": {
          "name": "contract_invoice_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(1000)",
          "nullable": false,
          "autoIncrement": false
        },
        "item_name": {
          "name": "item_name",
          "type": "varchar(500)",
          "nullable": false,
          "autoIncrement": false
        },
        "loading_point": {
          "name": "loading_point",
          "type": "varchar(500)",
          "nullable": false,
          "autoIncrement": false
        },
        "unloading_point": {
          "name": "unloading_point",
          "type": "varchar(500)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(18,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "gross_amount": {
          "name": "gross_amount",
          "type": "decimal(18,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_amount": {
          "name": "discount_amount",
          "type": "decimal(18,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "taxable_amount": {
          "name": "taxable_amount",
          "type": "decimal(18,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_amount": {
          "name": "tax_amount",
          "type": "decimal(18,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "total_amount": {
          "name": "total_amount",
          "type": "decimal(18,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_price": {
          "name": "unit_price",
          "type": "decimal(24,12)",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_discount": {
          "name": "unit_discount",
          "type": "decimal(24,12)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "converted_users": {
      "name": "converted_users",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "convert_delegate_id": {
          "name": "convert_delegate_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "convert_customer_dept": {
      "name": "convert_customer_dept",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "from_customer": {
          "name": "from_customer",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "to_customer": {
          "name": "to_customer",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "user_id": {
          "name": "user_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "final_dept": {
          "name": "final_dept",
          "type": "decimal(8,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "convert_delegates": {
      "name": "convert_delegates",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "from_delegate": {
          "name": "from_delegate",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "to_delegate": {
          "name": "to_delegate",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "user_id": {
          "name": "user_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "creditnote": {
      "name": "creditnote",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "bol": {
          "name": "bol",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount": {
          "name": "discount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_type": {
          "name": "discount_type",
          "type": "varchar(50)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "varchar(50)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "paid": {
          "name": "paid",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "remain": {
          "name": "remain",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "check_supply": {
          "name": "check_supply",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_offers": {
          "name": "discount_offers",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "ref_number": {
          "name": "ref_number",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "casher_id": {
          "name": "casher_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "netProfit": {
          "name": "netProfit",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "item_discount": {
          "name": "item_discount",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "zatca_status": {
          "name": "zatca_status",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "zatca_message": {
          "name": "zatca_message",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "currencies": {
      "name": "currencies",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(60)",
          "nullable": false,
          "autoIncrement": false
        },
        "curr_abrev": {
          "name": "curr_abrev",
          "type": "char(3)",
          "nullable": false,
          "autoIncrement": false
        },
        "curr_symbol": {
          "name": "curr_symbol",
          "type": "varchar(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "country": {
          "name": "country",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "hundreds_name": {
          "name": "hundreds_name",
          "type": "varchar(15)",
          "nullable": false,
          "autoIncrement": false
        },
        "auto_update": {
          "name": "auto_update",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "inactive": {
          "name": "inactive",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "custody": {
      "name": "custody",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "employee_id": {
          "name": "employee_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "account_id": {
          "name": "account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "attach": {
          "name": "attach",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "journal_id": {
          "name": "journal_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "custody_2025": {
      "name": "custody_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "employee_id": {
          "name": "employee_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "account_id": {
          "name": "account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "attach": {
          "name": "attach",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "journal_id": {
          "name": "journal_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "customers": {
      "name": "customers",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "name_en": {
          "name": "name_en",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "city_id": {
          "name": "city_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "region_id": {
          "name": "region_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "limit": {
          "name": "limit",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "interval": {
          "name": "interval",
          "type": "varchar(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "latitude": {
          "name": "latitude",
          "type": "varchar(200)",
          "nullable": true,
          "autoIncrement": false
        },
        "longitude": {
          "name": "longitude",
          "type": "varchar(200)",
          "nullable": true,
          "autoIncrement": false
        },
        "commercial_register": {
          "name": "commercial_register",
          "type": "varchar(255)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_number": {
          "name": "tax_number",
          "type": "varchar(30)",
          "nullable": true,
          "autoIncrement": false
        },
        "email": {
          "name": "email",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "mobile": {
          "name": "mobile",
          "type": "varchar(12)",
          "nullable": true,
          "autoIncrement": false
        },
        "fax": {
          "name": "fax",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "map_address": {
          "name": "map_address",
          "type": "varchar(100)",
          "nullable": true,
          "autoIncrement": false
        },
        "bank": {
          "name": "bank",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_by": {
          "name": "created_by",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "gl_account_id": {
          "name": "gl_account_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "category_id": {
          "name": "category_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "itinerary": {
          "name": "itinerary",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "neighborhood": {
          "name": "neighborhood",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "street": {
          "name": "street",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_image": {
          "name": "tax_image",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "contract_image": {
          "name": "contract_image",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "number_visits": {
          "name": "number_visits",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "accountant_name": {
          "name": "accountant_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "auto_customer_discount": {
          "name": "auto_customer_discount",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "discount_type": {
          "name": "discount_type",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "customer_code": {
          "name": "customer_code",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "customer_serial": {
          "name": "customer_serial",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "membership_no": {
          "name": "membership_no",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "active": {
          "name": "active",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "Cust_BuildingNumber": {
          "name": "Cust_BuildingNumber",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "Cust_PostalZone": {
          "name": "Cust_PostalZone",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "num_weeks_visits": {
          "name": "num_weeks_visits",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "group_id": {
          "name": "group_id",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "dont_allow_return": {
          "name": "dont_allow_return",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "dont_allow_return_damage": {
          "name": "dont_allow_return_damage",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "customer_area_id": {
          "name": "customer_area_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "postponed_customer": {
          "name": "postponed_customer",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "approved": {
          "name": "approved",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "commission_rate": {
          "name": "commission_rate",
          "type": "decimal(8,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "commission_rate_account_id": {
          "name": "commission_rate_account_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "delivery_value": {
          "name": "delivery_value",
          "type": "decimal(8,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "delivery_value_account_id": {
          "name": "delivery_value_account_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "system_type": {
          "name": "system_type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "city_name": {
          "name": "city_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "plot_identification": {
          "name": "plot_identification",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "customer_type": {
          "name": "customer_type",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_type": {
          "name": "tax_type",
          "type": "tinyint(4)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "customers_category_target": {
      "name": "customers_category_target",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "category_id": {
          "name": "category_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "month": {
          "name": "month",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "value": {
          "name": "value",
          "type": "decimal(10,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "collections": {
          "name": "collections",
          "type": "decimal(10,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "customer_add_targets": {
      "name": "customer_add_targets",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "month": {
          "name": "month",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "customers_count": {
          "name": "customers_count",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "commission_value": {
          "name": "commission_value",
          "type": "decimal(10,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "target_rate": {
          "name": "target_rate",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "customer_areas": {
      "name": "customer_areas",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "city_id": {
          "name": "city_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "customer_brokers": {
      "name": "customer_brokers",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "tinyint(4)",
          "nullable": false,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "address": {
          "name": "address",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "phone": {
          "name": "phone",
          "type": "varchar(50)",
          "nullable": true,
          "autoIncrement": false
        },
        "residence_no": {
          "name": "residence_no",
          "type": "varchar(100)",
          "nullable": true,
          "autoIncrement": false
        },
        "opening_balance": {
          "name": "opening_balance",
          "type": "decimal(20,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "credit_limit": {
          "name": "credit_limit",
          "type": "decimal(20,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "credit_period_days": {
          "name": "credit_period_days",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "sales_commission_percent": {
          "name": "sales_commission_percent",
          "type": "decimal(5,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "collection_commission_percent": {
          "name": "collection_commission_percent",
          "type": "decimal(5,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "account_id": {
          "name": "account_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "customer_categories": {
      "name": "customer_categories",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(100)",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_account_id": {
          "name": "gl_account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "sales_accounting_id": {
          "name": "sales_accounting_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "sales_cost_accounting_id": {
          "name": "sales_cost_accounting_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "damaged_store_id": {
          "name": "damaged_store_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "customers_gl_account_type_id": {
          "name": "customers_gl_account_type_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "customer_group": {
      "name": "customer_group",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "name_ar": {
          "name": "name_ar",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "name_en": {
          "name": "name_en",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "customer_images": {
      "name": "customer_images",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "real_name": {
          "name": "real_name",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "customer_paid_bank": {
      "name": "customer_paid_bank",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "cash_receipt_id": {
          "name": "cash_receipt_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "remain": {
          "name": "remain",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "bill_id": {
          "name": "bill_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "debitnote": {
      "name": "debitnote",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "supplier_id": {
          "name": "supplier_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "attachment": {
          "name": "attachment",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "uuid": {
          "name": "uuid",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_hash": {
          "name": "invoice_hash",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "signing_time": {
          "name": "signing_time",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "xml": {
          "name": "xml",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "sent_to_zatca": {
          "name": "sent_to_zatca",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "QrCode": {
          "name": "QrCode",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "zatca_error": {
          "name": "zatca_error",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "debitnote_2025": {
      "name": "debitnote_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "supplier_id": {
          "name": "supplier_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "attachment": {
          "name": "attachment",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "uuid": {
          "name": "uuid",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_hash": {
          "name": "invoice_hash",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "signing_time": {
          "name": "signing_time",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "xml": {
          "name": "xml",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "sent_to_zatca": {
          "name": "sent_to_zatca",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "QrCode": {
          "name": "QrCode",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "zatca_error": {
          "name": "zatca_error",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "delegate_categories": {
      "name": "delegate_categories",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "category_id": {
          "name": "category_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "delegate_indebtednesses": {
      "name": "delegate_indebtednesses",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "from_delegate": {
          "name": "from_delegate",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "to_delegate": {
          "name": "to_delegate",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "delegate_routes": {
      "name": "delegate_routes",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "region_id": {
          "name": "region_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "city_id": {
          "name": "city_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "active": {
          "name": "active",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_by": {
          "name": "created_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "delegate_route_areas": {
      "name": "delegate_route_areas",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "delegate_route_id": {
          "name": "delegate_route_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_area_id": {
          "name": "customer_area_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "delegate_route_customers": {
      "name": "delegate_route_customers",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "delegate_route_id": {
          "name": "delegate_route_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "visit_order": {
          "name": "visit_order",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "delegate_route_cycles": {
      "name": "delegate_route_cycles",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "start_date": {
          "name": "start_date",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        },
        "comment": {
          "name": "comment",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "active": {
          "name": "active",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_by": {
          "name": "created_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "delegate_route_cycle_routes": {
      "name": "delegate_route_cycle_routes",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "delegate_route_cycle_id": {
          "name": "delegate_route_cycle_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "delegate_route_id": {
          "name": "delegate_route_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "position": {
          "name": "position",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "delegate_tracking": {
      "name": "delegate_tracking",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "address": {
          "name": "address",
          "type": "varchar(255)",
          "nullable": true,
          "autoIncrement": false
        },
        "latitude": {
          "name": "latitude",
          "type": "varchar(100)",
          "nullable": true,
          "autoIncrement": false
        },
        "longitude": {
          "name": "longitude",
          "type": "varchar(100)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "gps_state": {
          "name": "gps_state",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "delivery_notes": {
      "name": "delivery_notes",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "bol": {
          "name": "bol",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount": {
          "name": "discount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_type": {
          "name": "discount_type",
          "type": "varchar(50)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "varchar(50)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "paid": {
          "name": "paid",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "remain": {
          "name": "remain",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "check_supply": {
          "name": "check_supply",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_offers": {
          "name": "discount_offers",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "ref_number": {
          "name": "ref_number",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "casher_id": {
          "name": "casher_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "netProfit": {
          "name": "netProfit",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "item_discount": {
          "name": "item_discount",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "approved": {
          "name": "approved",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "zatca_status": {
          "name": "zatca_status",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "zatca_message": {
          "name": "zatca_message",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "uuid": {
          "name": "uuid",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_hash": {
          "name": "invoice_hash",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "signing_time": {
          "name": "signing_time",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "xml": {
          "name": "xml",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "sent_to_zatca": {
          "name": "sent_to_zatca",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "delivery_notes_2025": {
      "name": "delivery_notes_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "bol": {
          "name": "bol",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount": {
          "name": "discount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_type": {
          "name": "discount_type",
          "type": "varchar(50)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "varchar(50)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "paid": {
          "name": "paid",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "remain": {
          "name": "remain",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "check_supply": {
          "name": "check_supply",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_offers": {
          "name": "discount_offers",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "ref_number": {
          "name": "ref_number",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "casher_id": {
          "name": "casher_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "netProfit": {
          "name": "netProfit",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "item_discount": {
          "name": "item_discount",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "approved": {
          "name": "approved",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "zatca_status": {
          "name": "zatca_status",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "zatca_message": {
          "name": "zatca_message",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "uuid": {
          "name": "uuid",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_hash": {
          "name": "invoice_hash",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "signing_time": {
          "name": "signing_time",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "xml": {
          "name": "xml",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "sent_to_zatca": {
          "name": "sent_to_zatca",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "delivery_notes_details": {
      "name": "delivery_notes_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "bill_id": {
          "name": "bill_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "total_price": {
          "name": "total_price",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_price": {
          "name": "unit_price",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(1000)",
          "nullable": false,
          "autoIncrement": false
        },
        "expire_date": {
          "name": "expire_date",
          "type": "varchar(50)",
          "nullable": true,
          "autoIncrement": false
        },
        "discount_quantity": {
          "name": "discount_quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "item_discount_value": {
          "name": "item_discount_value",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "delivery_notes_details_2025": {
      "name": "delivery_notes_details_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "bill_id": {
          "name": "bill_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "total_price": {
          "name": "total_price",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_price": {
          "name": "unit_price",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(1000)",
          "nullable": false,
          "autoIncrement": false
        },
        "expire_date": {
          "name": "expire_date",
          "type": "varchar(50)",
          "nullable": true,
          "autoIncrement": false
        },
        "discount_quantity": {
          "name": "discount_quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "item_discount_value": {
          "name": "item_discount_value",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "delivery_notes_logs": {
      "name": "delivery_notes_logs",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "DateTime": {
          "name": "DateTime",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "pump": {
          "name": "pump",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "station_id": {
          "name": "station_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "Transaction": {
          "name": "Transaction",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "FuelGradeId": {
          "name": "FuelGradeId",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "Volume": {
          "name": "Volume",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "Price": {
          "name": "Price",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "Amount": {
          "name": "Amount",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "UserId": {
          "name": "UserId",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "delivery_notes_logs_2025": {
      "name": "delivery_notes_logs_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "DateTime": {
          "name": "DateTime",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "pump": {
          "name": "pump",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "station_id": {
          "name": "station_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "Transaction": {
          "name": "Transaction",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "FuelGradeId": {
          "name": "FuelGradeId",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "Volume": {
          "name": "Volume",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "Price": {
          "name": "Price",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "Amount": {
          "name": "Amount",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "UserId": {
          "name": "UserId",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "deprecationassets": {
      "name": "deprecationassets",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "asset_id": {
          "name": "asset_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "from_date": {
          "name": "from_date",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "to_date": {
          "name": "to_date",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "journal_id": {
          "name": "journal_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "depreciation_method_assets": {
      "name": "depreciation_method_assets",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "value": {
          "name": "value",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "diacount_offers": {
      "name": "diacount_offers",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "diacount_offers_details": {
      "name": "diacount_offers_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "discount_offers_id": {
          "name": "discount_offers_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_value": {
          "name": "discount_value",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "size_id": {
          "name": "size_id",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "discounts": {
      "name": "discounts",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount": {
          "name": "discount",
          "type": "decimal(8,2)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "discount_quantities": {
      "name": "discount_quantities",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "cat_id": {
          "name": "cat_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "active": {
          "name": "active",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "discount_quantity_details": {
      "name": "discount_quantity_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "discount_quantity_id": {
          "name": "discount_quantity_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "free_quantity": {
          "name": "free_quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_name": {
          "name": "product_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "unit": {
          "name": "unit",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "distribution_regions": {
      "name": "distribution_regions",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "draft_bills": {
      "name": "draft_bills",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "cost_center_id": {
          "name": "cost_center_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        },
        "received_date": {
          "name": "received_date",
          "type": "datetime",
          "nullable": true,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "time",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,8)",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "decimal(15,8)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "decimal(8,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "decimal(15,8)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount": {
          "name": "discount",
          "type": "decimal(15,8)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_type": {
          "name": "discount_type",
          "type": "tinyint(4)",
          "nullable": false,
          "autoIncrement": false
        },
        "item_discount": {
          "name": "item_discount",
          "type": "tinyint(4)",
          "nullable": false,
          "autoIncrement": false
        },
        "ref_number": {
          "name": "ref_number",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "source": {
          "name": "source",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "tinyint(4)",
          "nullable": false,
          "autoIncrement": false
        },
        "posted_bill_id": {
          "name": "posted_bill_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_by": {
          "name": "created_by",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "bill_type": {
          "name": "bill_type",
          "type": "tinyint(4)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "draft_bill_details": {
      "name": "draft_bill_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "draft_bill_id": {
          "name": "draft_bill_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost_center_id": {
          "name": "cost_center_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(12,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_quantity": {
          "name": "discount_quantity",
          "type": "decimal(12,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_price": {
          "name": "unit_price",
          "type": "decimal(15,8)",
          "nullable": false,
          "autoIncrement": false
        },
        "total_price": {
          "name": "total_price",
          "type": "decimal(15,8)",
          "nullable": false,
          "autoIncrement": false
        },
        "item_discount_value": {
          "name": "item_discount_value",
          "type": "decimal(15,8)",
          "nullable": false,
          "autoIncrement": false
        },
        "item_tax_rate": {
          "name": "item_tax_rate",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "item_tax_amount": {
          "name": "item_tax_amount",
          "type": "decimal(15,8)",
          "nullable": false,
          "autoIncrement": false
        },
        "total_item_discount": {
          "name": "total_item_discount",
          "type": "decimal(15,8)",
          "nullable": false,
          "autoIncrement": false
        },
        "final_total": {
          "name": "final_total",
          "type": "decimal(15,8)",
          "nullable": false,
          "autoIncrement": false
        },
        "expire_date": {
          "name": "expire_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "received_date": {
          "name": "received_date",
          "type": "datetime",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "egg_cycle_monthly_expenses": {
      "name": "egg_cycle_monthly_expenses",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "egg_production_cycle_id": {
          "name": "egg_production_cycle_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "month": {
          "name": "month",
          "type": "tinyint(4)",
          "nullable": false,
          "autoIncrement": false
        },
        "year": {
          "name": "year",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "expense_type": {
          "name": "expense_type",
          "type": "enum('fixed','estimated')",
          "nullable": false,
          "autoIncrement": false
        },
        "item_name": {
          "name": "item_name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "estimated_amount": {
          "name": "estimated_amount",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "actual_amount": {
          "name": "actual_amount",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "is_adjusted": {
          "name": "is_adjusted",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "cost_center_tag_id": {
          "name": "cost_center_tag_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "payment_method": {
          "name": "payment_method",
          "type": "enum('account','payment_method')",
          "nullable": true,
          "autoIncrement": false
        },
        "internal_account_id": {
          "name": "internal_account_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "external_account_id": {
          "name": "external_account_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "internal_payment_method_id": {
          "name": "internal_payment_method_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "external_payment_method_id": {
          "name": "external_payment_method_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "transaction_date": {
          "name": "transaction_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "egg_daily_production": {
      "name": "egg_daily_production",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "egg_production_cycle_id": {
          "name": "egg_production_cycle_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "egg_production_cycle_barn_id": {
          "name": "egg_production_cycle_barn_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "size_serial": {
          "name": "size_serial",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(10,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "damaged_quantity": {
          "name": "damaged_quantity",
          "type": "decimal(10,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "egg_production_cycles": {
      "name": "egg_production_cycles",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "cycle_code": {
          "name": "cycle_code",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_serial": {
          "name": "branch_serial",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "from_date": {
          "name": "from_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "to_date": {
          "name": "to_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "total_chickens": {
          "name": "total_chickens",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "gl_account_id": {
          "name": "gl_account_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "approvemanager": {
          "name": "approvemanager",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "need_close": {
          "name": "need_close",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "enum('active','closed')",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "egg_production_cycle_barns": {
      "name": "egg_production_cycle_barns",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "egg_production_cycle_id": {
          "name": "egg_production_cycle_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "chicken_quantity": {
          "name": "chicken_quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "is_finished": {
          "name": "is_finished",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "endalternates": {
      "name": "endalternates",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "alternate_id": {
          "name": "alternate_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "endalternates_2025": {
      "name": "endalternates_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "alternate_id": {
          "name": "alternate_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "exchange_rates": {
      "name": "exchange_rates",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "currency_id": {
          "name": "currency_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "buy_rate": {
          "name": "buy_rate",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "sell_rate": {
          "name": "sell_rate",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "expectations": {
      "name": "expectations",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "deleted_at": {
          "name": "deleted_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "expectations_for_delegates": {
      "name": "expectations_for_delegates",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "month": {
          "name": "month",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "target_value_expected": {
          "name": "target_value_expected",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "expense_bills": {
      "name": "expense_bills",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "debit_account_id": {
          "name": "debit_account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "credit_account_id": {
          "name": "credit_account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "memo": {
          "name": "memo",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "expense_bills_2025": {
      "name": "expense_bills_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "debit_account_id": {
          "name": "debit_account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "credit_account_id": {
          "name": "credit_account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "memo": {
          "name": "memo",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "expense_bill_records": {
      "name": "expense_bill_records",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "product_number": {
          "name": "product_number",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "account_id": {
          "name": "account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "description": {
          "name": "description",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "reference": {
          "name": "reference",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "price": {
          "name": "price",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "total_price": {
          "name": "total_price",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "net_amount": {
          "name": "net_amount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_percentage": {
          "name": "tax_percentage",
          "type": "decimal(8,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_number": {
          "name": "tax_number",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "client_name": {
          "name": "client_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "cost_center_tag_id": {
          "name": "cost_center_tag_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "discount": {
          "name": "discount",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "expense_bill_records_2025": {
      "name": "expense_bill_records_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "product_number": {
          "name": "product_number",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "account_id": {
          "name": "account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "description": {
          "name": "description",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "reference": {
          "name": "reference",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "price": {
          "name": "price",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "total_price": {
          "name": "total_price",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "net_amount": {
          "name": "net_amount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_percentage": {
          "name": "tax_percentage",
          "type": "decimal(8,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_number": {
          "name": "tax_number",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "client_name": {
          "name": "client_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "cost_center_tag_id": {
          "name": "cost_center_tag_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "discount": {
          "name": "discount",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "expitems": {
      "name": "expitems",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "expectation_id": {
          "name": "expectation_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "external_orders": {
      "name": "external_orders",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "time",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount": {
          "name": "discount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_type": {
          "name": "discount_type",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "paid": {
          "name": "paid",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "remain": {
          "name": "remain",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "check_supply": {
          "name": "check_supply",
          "type": "tinyint(4)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_offers": {
          "name": "discount_offers",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "casher_id": {
          "name": "casher_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "netProfit": {
          "name": "netProfit",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "item_discount": {
          "name": "item_discount",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "approved": {
          "name": "approved",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "enum('تحت المراجعة','تم توزيعها','تم توصيلها','مرفوضة')",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "external_order_details": {
      "name": "external_order_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "external_order_id": {
          "name": "external_order_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "total_price": {
          "name": "total_price",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_price": {
          "name": "unit_price",
          "type": "decimal(10,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "item_discount_value": {
          "name": "item_discount_value",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_quantity": {
          "name": "discount_quantity",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "failed_jobs": {
      "name": "failed_jobs",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "connection": {
          "name": "connection",
          "type": "text",
          "nullable": false,
          "autoIncrement": false
        },
        "queue": {
          "name": "queue",
          "type": "text",
          "nullable": false,
          "autoIncrement": false
        },
        "payload": {
          "name": "payload",
          "type": "longtext",
          "nullable": false,
          "autoIncrement": false
        },
        "exception": {
          "name": "exception",
          "type": "longtext",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "filter_report_rolls": {
      "name": "filter_report_rolls",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "user_id": {
          "name": "user_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "report_columns_id": {
          "name": "report_columns_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "fiscal_years": {
      "name": "fiscal_years",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "begin": {
          "name": "begin",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        },
        "end": {
          "name": "end",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        },
        "is_closed": {
          "name": "is_closed",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "fixed_asset": {
      "name": "fixed_asset",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(8,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost": {
          "name": "cost",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "depreciation_ratio": {
          "name": "depreciation_ratio",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "depreciation_complex": {
          "name": "depreciation_complex",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "allowance_depreciation": {
          "name": "allowance_depreciation",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "expense_depreciation": {
          "name": "expense_depreciation",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "form_submission_tokens": {
      "name": "form_submission_tokens",
      "columns": {
        "token": {
          "name": "token",
          "type": "varchar(64)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "geidea_transactions": {
      "name": "geidea_transactions",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "pump": {
          "name": "pump",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "transaction": {
          "name": "transaction",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "state": {
          "name": "state",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "datetime_start": {
          "name": "datetime_start",
          "type": "datetime",
          "nullable": true,
          "autoIncrement": false
        },
        "datetime": {
          "name": "datetime",
          "type": "datetime",
          "nullable": true,
          "autoIncrement": false
        },
        "nozzle": {
          "name": "nozzle",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "volume": {
          "name": "volume",
          "type": "decimal(10,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "price": {
          "name": "price",
          "type": "decimal(10,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(10,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "geidea_amount": {
          "name": "geidea_amount",
          "type": "decimal(10,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "geidea_refund": {
          "name": "geidea_refund",
          "type": "decimal(10,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "geidea_rrn": {
          "name": "geidea_rrn",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "fuel_grade_id": {
          "name": "fuel_grade_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "bill_id": {
          "name": "bill_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "bill_type": {
          "name": "bill_type",
          "type": "tinyint(4)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "generalizations": {
      "name": "generalizations",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "title": {
          "name": "title",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "title_en": {
          "name": "title_en",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "description": {
          "name": "description",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "description_en": {
          "name": "description_en",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "general_table": {
      "name": "general_table",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "link_id": {
          "name": "link_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity_type": {
          "name": "quantity_type",
          "type": "varchar(3)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "expire_date": {
          "name": "expire_date",
          "type": "varchar(50)",
          "nullable": true,
          "autoIncrement": false
        },
        "cost": {
          "name": "cost",
          "type": "decimal(15,10)",
          "nullable": true,
          "autoIncrement": false
        },
        "production_date": {
          "name": "production_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "shelve_id": {
          "name": "shelve_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "add_cost": {
          "name": "add_cost",
          "type": "decimal(15,10)",
          "nullable": false,
          "autoIncrement": false
        },
        "main_product": {
          "name": "main_product",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "ArticleID": {
          "name": "ArticleID",
          "type": "char(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "details_id": {
          "name": "details_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "cycle_patch": {
          "name": "cycle_patch",
          "type": "varchar(50)",
          "nullable": true,
          "autoIncrement": false
        },
        "pieces_count": {
          "name": "pieces_count",
          "type": "decimal(15,3)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "general_table_2025": {
      "name": "general_table_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "link_id": {
          "name": "link_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity_type": {
          "name": "quantity_type",
          "type": "varchar(3)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "expire_date": {
          "name": "expire_date",
          "type": "varchar(50)",
          "nullable": true,
          "autoIncrement": false
        },
        "cost": {
          "name": "cost",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "production_date": {
          "name": "production_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "shelve_id": {
          "name": "shelve_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "add_cost": {
          "name": "add_cost",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "main_product": {
          "name": "main_product",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "ArticleID": {
          "name": "ArticleID",
          "type": "char(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "details_id": {
          "name": "details_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "cycle_patch": {
          "name": "cycle_patch",
          "type": "varchar(50)",
          "nullable": true,
          "autoIncrement": false
        },
        "pieces_count": {
          "name": "pieces_count",
          "type": "decimal(15,3)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "geographic_sections": {
      "name": "geographic_sections",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "type_id": {
          "name": "type_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost_center_tag_id": {
          "name": "cost_center_tag_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "geographic_section_types": {
      "name": "geographic_section_types",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "slug": {
          "name": "slug",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "gl_trans": {
      "name": "gl_trans",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "deleted_at": {
          "name": "deleted_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "type_id": {
          "name": "type_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "type_no": {
          "name": "type_no",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "trans_date": {
          "name": "trans_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "account_id": {
          "name": "account_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "memo": {
          "name": "memo",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "default_tax": {
          "name": "default_tax",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "dimension_id": {
          "name": "dimension_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "dimension2_id": {
          "name": "dimension2_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost_center_tag_id": {
          "name": "cost_center_tag_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "person_type_id": {
          "name": "person_type_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "person_id": {
          "name": "person_id",
          "type": "blob",
          "nullable": true,
          "autoIncrement": false
        },
        "cost_center_categ_id": {
          "name": "cost_center_categ_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "approved": {
          "name": "approved",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_rate": {
          "name": "tax_rate",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_number": {
          "name": "tax_number",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_account_id": {
          "name": "tax_account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_memo": {
          "name": "tax_memo",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "is_taxable_journal": {
          "name": "is_taxable_journal",
          "type": "tinyint(4)",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "person_name": {
          "name": "person_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "trans_type": {
          "name": "trans_type",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "gl_trans_2025": {
      "name": "gl_trans_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "deleted_at": {
          "name": "deleted_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "type_id": {
          "name": "type_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "type_no": {
          "name": "type_no",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "trans_date": {
          "name": "trans_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "account_id": {
          "name": "account_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "memo": {
          "name": "memo",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "default_tax": {
          "name": "default_tax",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "dimension_id": {
          "name": "dimension_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "dimension2_id": {
          "name": "dimension2_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost_center_tag_id": {
          "name": "cost_center_tag_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "person_type_id": {
          "name": "person_type_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "person_id": {
          "name": "person_id",
          "type": "blob",
          "nullable": true,
          "autoIncrement": false
        },
        "cost_center_categ_id": {
          "name": "cost_center_categ_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "approved": {
          "name": "approved",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_rate": {
          "name": "tax_rate",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_number": {
          "name": "tax_number",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_account_id": {
          "name": "tax_account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_memo": {
          "name": "tax_memo",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "is_taxable_journal": {
          "name": "is_taxable_journal",
          "type": "tinyint(4)",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "person_name": {
          "name": "person_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "trans_type": {
          "name": "trans_type",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "gl_trans_template": {
      "name": "gl_trans_template",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "deleted_at": {
          "name": "deleted_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "type_id": {
          "name": "type_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "type_no": {
          "name": "type_no",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "trans_date": {
          "name": "trans_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "account_id": {
          "name": "account_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "memo": {
          "name": "memo",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "dimension_id": {
          "name": "dimension_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "dimension2_id": {
          "name": "dimension2_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost_center_tag_id": {
          "name": "cost_center_tag_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "person_type_id": {
          "name": "person_type_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "person_id": {
          "name": "person_id",
          "type": "blob",
          "nullable": true,
          "autoIncrement": false
        },
        "cost_center_categ_id": {
          "name": "cost_center_categ_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "approved": {
          "name": "approved",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_rate": {
          "name": "tax_rate",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_number": {
          "name": "tax_number",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_account_id": {
          "name": "tax_account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_memo": {
          "name": "tax_memo",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "is_taxable_journal": {
          "name": "is_taxable_journal",
          "type": "tinyint(4)",
          "nullable": false,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "grns": {
      "name": "grns",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "purchase_id": {
          "name": "purchase_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "memo": {
          "name": "memo",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "grn_details": {
      "name": "grn_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "grn_id": {
          "name": "grn_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "purchase_detail_id": {
          "name": "purchase_detail_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "received_quantity": {
          "name": "received_quantity",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_price": {
          "name": "unit_price",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "total_price": {
          "name": "total_price",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "expire_date": {
          "name": "expire_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "production_date": {
          "name": "production_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "grouped_cash_receipt": {
      "name": "grouped_cash_receipt",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "userid": {
          "name": "userid",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "attachment": {
          "name": "attachment",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "total_amount": {
          "name": "total_amount",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "group_discount": {
      "name": "group_discount",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "discount_value": {
          "name": "discount_value",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "group_discount_details": {
      "name": "group_discount_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "group_discount_id": {
          "name": "group_discount_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "productId": {
          "name": "productId",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "free_quantity": {
          "name": "free_quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_name": {
          "name": "product_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "unit": {
          "name": "unit",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "helps": {
      "name": "helps",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "title": {
          "name": "title",
          "type": "varchar(300)",
          "nullable": true,
          "autoIncrement": false
        },
        "description": {
          "name": "description",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "title_ar": {
          "name": "title_ar",
          "type": "text",
          "nullable": false,
          "autoIncrement": false
        },
        "description_ar": {
          "name": "description_ar",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "parent_id": {
          "name": "parent_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "installment_contract": {
      "name": "installment_contract",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "account_id": {
          "name": "account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "person_name": {
          "name": "person_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "total_amount": {
          "name": "total_amount",
          "type": "decimal(10,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "duration": {
          "name": "duration",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "installments_count": {
          "name": "installments_count",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "attache": {
          "name": "attache",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "description": {
          "name": "description",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "installment_contract_details": {
      "name": "installment_contract_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "installment_id": {
          "name": "installment_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(10,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "installment_date": {
          "name": "installment_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "internal_paids": {
      "name": "internal_paids",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "side_id": {
          "name": "side_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "cost_center_tag_id": {
          "name": "cost_center_tag_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "attachment": {
          "name": "attachment",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "cycle_barn_id": {
          "name": "cycle_barn_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "coverage_days": {
          "name": "coverage_days",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "coverage_start_date": {
          "name": "coverage_start_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "finish": {
          "name": "finish",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "dead_id": {
          "name": "dead_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "price_diff_account_id": {
          "name": "price_diff_account_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "internal_paids_2025": {
      "name": "internal_paids_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "side_id": {
          "name": "side_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "cost_center_tag_id": {
          "name": "cost_center_tag_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "attachment": {
          "name": "attachment",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "cycle_barn_id": {
          "name": "cycle_barn_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "finish": {
          "name": "finish",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "dead_id": {
          "name": "dead_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "internal_paid_details": {
      "name": "internal_paid_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "internal_paid_id": {
          "name": "internal_paid_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost": {
          "name": "cost",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "production_date": {
          "name": "production_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "custom_cost": {
          "name": "custom_cost",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "custom_total": {
          "name": "custom_total",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "internal_paid_details_2025": {
      "name": "internal_paid_details_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "internal_paid_id": {
          "name": "internal_paid_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost": {
          "name": "cost",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "production_date": {
          "name": "production_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "internal_receipts": {
      "name": "internal_receipts",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "side_id": {
          "name": "side_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "attachment": {
          "name": "attachment",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "finish": {
          "name": "finish",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "cycle_barn_id": {
          "name": "cycle_barn_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "dead_id": {
          "name": "dead_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "internal_receipts_2025": {
      "name": "internal_receipts_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "side_id": {
          "name": "side_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "attachment": {
          "name": "attachment",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "cycle_barn_id": {
          "name": "cycle_barn_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "finish": {
          "name": "finish",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "internal_receipt_details": {
      "name": "internal_receipt_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "internal_paid_id": {
          "name": "internal_paid_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost": {
          "name": "cost",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "production_date": {
          "name": "production_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "internal_receipt_details_2025": {
      "name": "internal_receipt_details_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "internal_paid_id": {
          "name": "internal_paid_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost": {
          "name": "cost",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "production_date": {
          "name": "production_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "internal_request_spares": {
      "name": "internal_request_spares",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "side_id": {
          "name": "side_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        },
        "is_converted": {
          "name": "is_converted",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "internal_request_spare_details": {
      "name": "internal_request_spare_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "internal_request_spare_id": {
          "name": "internal_request_spare_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "inventory": {
      "name": "inventory",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "invoice_sequences": {
      "name": "invoice_sequences",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "current_value": {
          "name": "current_value",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "itinerary": {
      "name": "itinerary",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "jobs": {
      "name": "jobs",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "queue": {
          "name": "queue",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "payload": {
          "name": "payload",
          "type": "longtext",
          "nullable": false,
          "autoIncrement": false
        },
        "attempts": {
          "name": "attempts",
          "type": "tinyint(3)",
          "nullable": false,
          "autoIncrement": false
        },
        "reserved_at": {
          "name": "reserved_at",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "available_at": {
          "name": "available_at",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "journal": {
      "name": "journal",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "deleted_at": {
          "name": "deleted_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "type_id": {
          "name": "type_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "trans_date": {
          "name": "trans_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "trans_no": {
          "name": "trans_no",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "reference": {
          "name": "reference",
          "type": "varchar(60)",
          "nullable": true,
          "autoIncrement": false
        },
        "source_ref": {
          "name": "source_ref",
          "type": "varchar(60)",
          "nullable": true,
          "autoIncrement": false
        },
        "event_date": {
          "name": "event_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "doc_date": {
          "name": "doc_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "currency_id": {
          "name": "currency_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "exchange_rate": {
          "name": "exchange_rate",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "memo": {
          "name": "memo",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "monthly_sequence": {
          "name": "monthly_sequence",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "user_id": {
          "name": "user_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "is_closed": {
          "name": "is_closed",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "is_cross": {
          "name": "is_cross",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "ref_serial": {
          "name": "ref_serial",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "attache": {
          "name": "attache",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "approved": {
          "name": "approved",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost_center_serial": {
          "name": "cost_center_serial",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_by": {
          "name": "updated_by",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "is_taxable": {
          "name": "is_taxable",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "repeat_trans": {
          "name": "repeat_trans",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "project_id": {
          "name": "project_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "claim_id": {
          "name": "claim_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "person_name": {
          "name": "person_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "installment_contract": {
          "name": "installment_contract",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "installment": {
          "name": "installment",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "digital_signature": {
          "name": "digital_signature",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "journal_2025": {
      "name": "journal_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "deleted_at": {
          "name": "deleted_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "type_id": {
          "name": "type_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "trans_date": {
          "name": "trans_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "trans_no": {
          "name": "trans_no",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "reference": {
          "name": "reference",
          "type": "varchar(60)",
          "nullable": true,
          "autoIncrement": false
        },
        "source_ref": {
          "name": "source_ref",
          "type": "varchar(60)",
          "nullable": true,
          "autoIncrement": false
        },
        "event_date": {
          "name": "event_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "doc_date": {
          "name": "doc_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "currency_id": {
          "name": "currency_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "exchange_rate": {
          "name": "exchange_rate",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "memo": {
          "name": "memo",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "monthly_sequence": {
          "name": "monthly_sequence",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "user_id": {
          "name": "user_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "is_closed": {
          "name": "is_closed",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "is_cross": {
          "name": "is_cross",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "ref_serial": {
          "name": "ref_serial",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "attache": {
          "name": "attache",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "approved": {
          "name": "approved",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost_center_serial": {
          "name": "cost_center_serial",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_by": {
          "name": "updated_by",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "is_taxable": {
          "name": "is_taxable",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "repeat_trans": {
          "name": "repeat_trans",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "project_id": {
          "name": "project_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "claim_id": {
          "name": "claim_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "person_name": {
          "name": "person_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "installment_contract": {
          "name": "installment_contract",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "installment": {
          "name": "installment",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "digital_signature": {
          "name": "digital_signature",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "journal_template": {
      "name": "journal_template",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "deleted_at": {
          "name": "deleted_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "type_id": {
          "name": "type_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "trans_date": {
          "name": "trans_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "trans_no": {
          "name": "trans_no",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "reference": {
          "name": "reference",
          "type": "varchar(60)",
          "nullable": true,
          "autoIncrement": false
        },
        "source_ref": {
          "name": "source_ref",
          "type": "varchar(60)",
          "nullable": true,
          "autoIncrement": false
        },
        "event_date": {
          "name": "event_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "doc_date": {
          "name": "doc_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "currency_id": {
          "name": "currency_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "exchange_rate": {
          "name": "exchange_rate",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "memo": {
          "name": "memo",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "monthly_sequence": {
          "name": "monthly_sequence",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "user_id": {
          "name": "user_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "is_closed": {
          "name": "is_closed",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "is_cross": {
          "name": "is_cross",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "ref_serial": {
          "name": "ref_serial",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "attache": {
          "name": "attache",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "approved": {
          "name": "approved",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost_center_serial": {
          "name": "cost_center_serial",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_by": {
          "name": "updated_by",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "is_taxable": {
          "name": "is_taxable",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "repeat_trans": {
          "name": "repeat_trans",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "project_id": {
          "name": "project_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "claim_id": {
          "name": "claim_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "person_name": {
          "name": "person_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "levels": {
      "name": "levels",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "count": {
          "name": "count",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "logs": {
      "name": "logs",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "user_id": {
          "name": "user_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "action": {
          "name": "action",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "loggable_id": {
          "name": "loggable_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "loggable_type": {
          "name": "loggable_type",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "page": {
          "name": "page",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "page_en": {
          "name": "page_en",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "logs_2025": {
      "name": "logs_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "user_id": {
          "name": "user_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "action": {
          "name": "action",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "loggable_id": {
          "name": "loggable_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "loggable_type": {
          "name": "loggable_type",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "page": {
          "name": "page",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "page_en": {
          "name": "page_en",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "management_users": {
      "name": "management_users",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "email": {
          "name": "email",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "password": {
          "name": "password",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "phone": {
          "name": "phone",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "remember_token": {
          "name": "remember_token",
          "type": "varchar(100)",
          "nullable": true,
          "autoIncrement": false
        },
        "deleted_at": {
          "name": "deleted_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_audit_logs": {
      "name": "manufacturing_audit_logs",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "entity_type": {
          "name": "entity_type",
          "type": "varchar(40)",
          "nullable": false,
          "autoIncrement": false
        },
        "entity_id": {
          "name": "entity_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "correlation_id": {
          "name": "correlation_id",
          "type": "char(36)",
          "nullable": true,
          "autoIncrement": false
        },
        "action": {
          "name": "action",
          "type": "varchar(50)",
          "nullable": false,
          "autoIncrement": false
        },
        "from_status": {
          "name": "from_status",
          "type": "varchar(30)",
          "nullable": true,
          "autoIncrement": false
        },
        "to_status": {
          "name": "to_status",
          "type": "varchar(30)",
          "nullable": true,
          "autoIncrement": false
        },
        "reason": {
          "name": "reason",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "before_values": {
          "name": "before_values",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "after_values": {
          "name": "after_values",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "payload": {
          "name": "payload",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "user_id": {
          "name": "user_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "ip_address": {
          "name": "ip_address",
          "type": "varchar(45)",
          "nullable": true,
          "autoIncrement": false
        },
        "device": {
          "name": "device",
          "type": "varchar(255)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_boms": {
      "name": "manufacturing_boms",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "varchar(40)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_size_serial": {
          "name": "product_size_serial",
          "type": "varchar(80)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_size_label": {
          "name": "product_size_label",
          "type": "varchar(120)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_size_conversion": {
          "name": "product_size_conversion",
          "type": "decimal(18,6)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "routing_id": {
          "name": "routing_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "version": {
          "name": "version",
          "type": "varchar(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "base_quantity": {
          "name": "base_quantity",
          "type": "decimal(18,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "expected_scrap_percent": {
          "name": "expected_scrap_percent",
          "type": "decimal(5,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "effective_from": {
          "name": "effective_from",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        },
        "effective_to": {
          "name": "effective_to",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "enum('draft','active','inactive')",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "created_by": {
          "name": "created_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "approved_by": {
          "name": "approved_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "approved_at": {
          "name": "approved_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_bom_items": {
      "name": "manufacturing_bom_items",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "bom_id": {
          "name": "bom_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "size_serial": {
          "name": "size_serial",
          "type": "varchar(80)",
          "nullable": true,
          "autoIncrement": false
        },
        "size_label": {
          "name": "size_label",
          "type": "varchar(120)",
          "nullable": true,
          "autoIncrement": false
        },
        "size_conversion": {
          "name": "size_conversion",
          "type": "decimal(18,6)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(18,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "scrap_percent": {
          "name": "scrap_percent",
          "type": "decimal(5,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "is_backflush": {
          "name": "is_backflush",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "sequence": {
          "name": "sequence",
          "type": "smallint(5)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_bom_labor_requirements": {
      "name": "manufacturing_bom_labor_requirements",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "bom_id": {
          "name": "bom_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "routing_operation_id": {
          "name": "routing_operation_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "labor_category_id": {
          "name": "labor_category_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "worker_count": {
          "name": "worker_count",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "planned_hours": {
          "name": "planned_hours",
          "type": "decimal(18,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "sequence": {
          "name": "sequence",
          "type": "smallint(5)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_bom_machine_requirements": {
      "name": "manufacturing_bom_machine_requirements",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "bom_id": {
          "name": "bom_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "routing_operation_id": {
          "name": "routing_operation_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "machine_category_id": {
          "name": "machine_category_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "machine_count": {
          "name": "machine_count",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "planned_hours": {
          "name": "planned_hours",
          "type": "decimal(18,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "sequence": {
          "name": "sequence",
          "type": "smallint(5)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_confirmations": {
      "name": "manufacturing_confirmations",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "idempotency_key": {
          "name": "idempotency_key",
          "type": "char(36)",
          "nullable": false,
          "autoIncrement": false
        },
        "correlation_id": {
          "name": "correlation_id",
          "type": "char(36)",
          "nullable": false,
          "autoIncrement": false
        },
        "order_id": {
          "name": "order_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "order_operation_id": {
          "name": "order_operation_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "confirmation_type": {
          "name": "confirmation_type",
          "type": "enum('partial','final')",
          "nullable": false,
          "autoIncrement": false
        },
        "good_quantity": {
          "name": "good_quantity",
          "type": "decimal(18,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "scrap_quantity": {
          "name": "scrap_quantity",
          "type": "decimal(18,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "rework_quantity": {
          "name": "rework_quantity",
          "type": "decimal(18,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "actual_minutes": {
          "name": "actual_minutes",
          "type": "decimal(12,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "actual_machine_minutes": {
          "name": "actual_machine_minutes",
          "type": "decimal(12,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "actual_labor_minutes": {
          "name": "actual_labor_minutes",
          "type": "decimal(12,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "reason_code": {
          "name": "reason_code",
          "type": "varchar(40)",
          "nullable": true,
          "autoIncrement": false
        },
        "confirmed_by": {
          "name": "confirmed_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "confirmed_at": {
          "name": "confirmed_at",
          "type": "timestamp",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_cost_entries": {
      "name": "manufacturing_cost_entries",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "correlation_id": {
          "name": "correlation_id",
          "type": "char(36)",
          "nullable": false,
          "autoIncrement": false
        },
        "order_id": {
          "name": "order_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "period": {
          "name": "period",
          "type": "varchar(7)",
          "nullable": false,
          "autoIncrement": false
        },
        "component": {
          "name": "component",
          "type": "enum('material','labor','machine','electricity','water','overhead','subcontract','variance','wip')",
          "nullable": false,
          "autoIncrement": false
        },
        "entry_type": {
          "name": "entry_type",
          "type": "enum('plan','actual','applied','settlement','reversal','revaluation')",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(18,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "rate": {
          "name": "rate",
          "type": "decimal(18,6)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(18,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "currency_code": {
          "name": "currency_code",
          "type": "varchar(3)",
          "nullable": true,
          "autoIncrement": false
        },
        "source_type": {
          "name": "source_type",
          "type": "varchar(50)",
          "nullable": false,
          "autoIncrement": false
        },
        "source_reference": {
          "name": "source_reference",
          "type": "varchar(80)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_by": {
          "name": "created_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "posted_at": {
          "name": "posted_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_cost_settings": {
      "name": "manufacturing_cost_settings",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "electricity_unit_cost": {
          "name": "electricity_unit_cost",
          "type": "decimal(18,6)",
          "nullable": false,
          "autoIncrement": false
        },
        "water_unit_cost": {
          "name": "water_unit_cost",
          "type": "decimal(18,6)",
          "nullable": false,
          "autoIncrement": false
        },
        "electricity_credit_account_id": {
          "name": "electricity_credit_account_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "water_credit_account_id": {
          "name": "water_credit_account_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_instruction_acknowledgements": {
      "name": "manufacturing_instruction_acknowledgements",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "order_operation_id": {
          "name": "order_operation_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "work_instruction_id": {
          "name": "work_instruction_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "instruction_version": {
          "name": "instruction_version",
          "type": "varchar(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "acknowledged_by": {
          "name": "acknowledged_by",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "acknowledged_at": {
          "name": "acknowledged_at",
          "type": "timestamp",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_labor_categories": {
      "name": "manufacturing_labor_categories",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "varchar(40)",
          "nullable": false,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(150)",
          "nullable": false,
          "autoIncrement": false
        },
        "base_hourly_rate": {
          "name": "base_hourly_rate",
          "type": "decimal(18,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "credit_account_id": {
          "name": "credit_account_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "is_active": {
          "name": "is_active",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_lots": {
      "name": "manufacturing_lots",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "lot_number": {
          "name": "lot_number",
          "type": "varchar(80)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "source_order_id": {
          "name": "source_order_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(18,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "quality_status": {
          "name": "quality_status",
          "type": "enum('quality','released','blocked','rejected')",
          "nullable": false,
          "autoIncrement": false
        },
        "production_date": {
          "name": "production_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "expiry_date": {
          "name": "expiry_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "attributes": {
          "name": "attributes",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_lot_links": {
      "name": "manufacturing_lot_links",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "parent_lot_id": {
          "name": "parent_lot_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "child_lot_id": {
          "name": "child_lot_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "order_id": {
          "name": "order_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "link_type": {
          "name": "link_type",
          "type": "enum('consume','produce','split','merge','rework')",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(18,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_machines": {
      "name": "manufacturing_machines",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "machine_category_id": {
          "name": "machine_category_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "varchar(40)",
          "nullable": false,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(150)",
          "nullable": false,
          "autoIncrement": false
        },
        "average_electricity_per_hour": {
          "name": "average_electricity_per_hour",
          "type": "decimal(18,6)",
          "nullable": true,
          "autoIncrement": false
        },
        "average_water_per_hour": {
          "name": "average_water_per_hour",
          "type": "decimal(18,6)",
          "nullable": true,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "enum('available','planned_stop','breakdown','blocked')",
          "nullable": false,
          "autoIncrement": false
        },
        "counter_value": {
          "name": "counter_value",
          "type": "decimal(18,3)",
          "nullable": true,
          "autoIncrement": false
        },
        "maintenance_due_date": {
          "name": "maintenance_due_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "is_active": {
          "name": "is_active",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_machine_categories": {
      "name": "manufacturing_machine_categories",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "varchar(40)",
          "nullable": false,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(150)",
          "nullable": false,
          "autoIncrement": false
        },
        "depreciation_hourly_rate": {
          "name": "depreciation_hourly_rate",
          "type": "decimal(18,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "average_electricity_per_hour": {
          "name": "average_electricity_per_hour",
          "type": "decimal(18,6)",
          "nullable": false,
          "autoIncrement": false
        },
        "average_water_per_hour": {
          "name": "average_water_per_hour",
          "type": "decimal(18,6)",
          "nullable": false,
          "autoIncrement": false
        },
        "depreciation_credit_account_id": {
          "name": "depreciation_credit_account_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "is_active": {
          "name": "is_active",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_material_alternatives": {
      "name": "manufacturing_material_alternatives",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "original_product_id": {
          "name": "original_product_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "alternative_product_id": {
          "name": "alternative_product_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "conversion_factor": {
          "name": "conversion_factor",
          "type": "decimal(18,6)",
          "nullable": false,
          "autoIncrement": false
        },
        "priority": {
          "name": "priority",
          "type": "smallint(5)",
          "nullable": false,
          "autoIncrement": false
        },
        "max_cost_increase_percent": {
          "name": "max_cost_increase_percent",
          "type": "decimal(7,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "requires_quality_approval": {
          "name": "requires_quality_approval",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "is_active": {
          "name": "is_active",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "quality_condition": {
          "name": "quality_condition",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "created_by": {
          "name": "created_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_material_movements": {
      "name": "manufacturing_material_movements",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "idempotency_key": {
          "name": "idempotency_key",
          "type": "char(36)",
          "nullable": false,
          "autoIncrement": false
        },
        "correlation_id": {
          "name": "correlation_id",
          "type": "char(36)",
          "nullable": false,
          "autoIncrement": false
        },
        "order_id": {
          "name": "order_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "order_material_id": {
          "name": "order_material_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "size_serial": {
          "name": "size_serial",
          "type": "varchar(80)",
          "nullable": true,
          "autoIncrement": false
        },
        "size_label": {
          "name": "size_label",
          "type": "varchar(120)",
          "nullable": true,
          "autoIncrement": false
        },
        "size_conversion": {
          "name": "size_conversion",
          "type": "decimal(18,6)",
          "nullable": false,
          "autoIncrement": false
        },
        "movement_type": {
          "name": "movement_type",
          "type": "enum('issue','return')",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(18,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "usable_quantity": {
          "name": "usable_quantity",
          "type": "decimal(18,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "scrap_quantity": {
          "name": "scrap_quantity",
          "type": "decimal(18,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "base_quantity": {
          "name": "base_quantity",
          "type": "decimal(18,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_cost": {
          "name": "unit_cost",
          "type": "decimal(18,6)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(18,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "batch_number": {
          "name": "batch_number",
          "type": "varchar(80)",
          "nullable": true,
          "autoIncrement": false
        },
        "general_table_id": {
          "name": "general_table_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_by": {
          "name": "created_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "posted_at": {
          "name": "posted_at",
          "type": "timestamp",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_operation_events": {
      "name": "manufacturing_operation_events",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "order_id": {
          "name": "order_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "order_operation_id": {
          "name": "order_operation_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "correlation_id": {
          "name": "correlation_id",
          "type": "char(36)",
          "nullable": true,
          "autoIncrement": false
        },
        "event_type": {
          "name": "event_type",
          "type": "enum('start','pause','resume','stop')",
          "nullable": false,
          "autoIncrement": false
        },
        "reason_code": {
          "name": "reason_code",
          "type": "varchar(60)",
          "nullable": true,
          "autoIncrement": false
        },
        "event_at": {
          "name": "event_at",
          "type": "timestamp",
          "nullable": false,
          "autoIncrement": false
        },
        "user_id": {
          "name": "user_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_orders": {
      "name": "manufacturing_orders",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "order_number": {
          "name": "order_number",
          "type": "varchar(40)",
          "nullable": false,
          "autoIncrement": false
        },
        "correlation_id": {
          "name": "correlation_id",
          "type": "char(36)",
          "nullable": true,
          "autoIncrement": false
        },
        "bom_id": {
          "name": "bom_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "routing_id": {
          "name": "routing_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_size_serial": {
          "name": "product_size_serial",
          "type": "varchar(80)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_size_label": {
          "name": "product_size_label",
          "type": "varchar(120)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_size_conversion": {
          "name": "product_size_conversion",
          "type": "decimal(18,6)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "cost_center_tag_id": {
          "name": "cost_center_tag_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "material_store_id": {
          "name": "material_store_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "finished_store_id": {
          "name": "finished_store_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "planned_quantity": {
          "name": "planned_quantity",
          "type": "decimal(18,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "actual_quantity": {
          "name": "actual_quantity",
          "type": "decimal(18,3)",
          "nullable": true,
          "autoIncrement": false
        },
        "scrap_quantity": {
          "name": "scrap_quantity",
          "type": "decimal(18,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "standard_cost": {
          "name": "standard_cost",
          "type": "decimal(18,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "actual_cost": {
          "name": "actual_cost",
          "type": "decimal(18,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "planned_start_date": {
          "name": "planned_start_date",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        },
        "planned_end_date": {
          "name": "planned_end_date",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        },
        "started_at": {
          "name": "started_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "completed_at": {
          "name": "completed_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "inventory_posted_at": {
          "name": "inventory_posted_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "enum('draft','released','in_progress','completed','cancelled')",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "created_by": {
          "name": "created_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "released_by": {
          "name": "released_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "completed_by": {
          "name": "completed_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "technical_completed_at": {
          "name": "technical_completed_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "financially_closed_at": {
          "name": "financially_closed_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "inventory_reversed_at": {
          "name": "inventory_reversed_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "lock_version": {
          "name": "lock_version",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_order_additional_costs": {
      "name": "manufacturing_order_additional_costs",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "order_id": {
          "name": "order_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "additional_cost_id": {
          "name": "additional_cost_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "description": {
          "name": "description",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(18,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "credit_account_id": {
          "name": "credit_account_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost_center_tag_id": {
          "name": "cost_center_tag_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_by": {
          "name": "created_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_order_labor_usages": {
      "name": "manufacturing_order_labor_usages",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "order_id": {
          "name": "order_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "order_operation_id": {
          "name": "order_operation_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "labor_category_id": {
          "name": "labor_category_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "user_id": {
          "name": "user_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "shift_id": {
          "name": "shift_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "worker_count": {
          "name": "worker_count",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "actual_hours": {
          "name": "actual_hours",
          "type": "decimal(18,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "base_rate_snapshot": {
          "name": "base_rate_snapshot",
          "type": "decimal(18,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "shift_factor_snapshot": {
          "name": "shift_factor_snapshot",
          "type": "decimal(10,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "effective_rate_snapshot": {
          "name": "effective_rate_snapshot",
          "type": "decimal(18,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "total_cost": {
          "name": "total_cost",
          "type": "decimal(18,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "credit_account_id_snapshot": {
          "name": "credit_account_id_snapshot",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "cost_center_tag_id": {
          "name": "cost_center_tag_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_by": {
          "name": "created_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_order_machine_usages": {
      "name": "manufacturing_order_machine_usages",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "order_id": {
          "name": "order_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "order_operation_id": {
          "name": "order_operation_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "machine_category_id": {
          "name": "machine_category_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "machine_id": {
          "name": "machine_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "machine_count": {
          "name": "machine_count",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "actual_hours": {
          "name": "actual_hours",
          "type": "decimal(18,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "depreciation_rate_snapshot": {
          "name": "depreciation_rate_snapshot",
          "type": "decimal(18,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "total_cost": {
          "name": "total_cost",
          "type": "decimal(18,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "credit_account_id_snapshot": {
          "name": "credit_account_id_snapshot",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "cost_center_tag_id": {
          "name": "cost_center_tag_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_by": {
          "name": "created_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_order_materials": {
      "name": "manufacturing_order_materials",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "order_id": {
          "name": "order_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "original_product_id": {
          "name": "original_product_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "original_size_serial": {
          "name": "original_size_serial",
          "type": "varchar(80)",
          "nullable": true,
          "autoIncrement": false
        },
        "original_size_label": {
          "name": "original_size_label",
          "type": "varchar(120)",
          "nullable": true,
          "autoIncrement": false
        },
        "original_size_conversion": {
          "name": "original_size_conversion",
          "type": "decimal(18,6)",
          "nullable": true,
          "autoIncrement": false
        },
        "original_planned_quantity": {
          "name": "original_planned_quantity",
          "type": "decimal(18,3)",
          "nullable": true,
          "autoIncrement": false
        },
        "original_standard_unit_cost": {
          "name": "original_standard_unit_cost",
          "type": "decimal(18,6)",
          "nullable": true,
          "autoIncrement": false
        },
        "material_alternative_id": {
          "name": "material_alternative_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "alternative_conversion_factor": {
          "name": "alternative_conversion_factor",
          "type": "decimal(18,6)",
          "nullable": true,
          "autoIncrement": false
        },
        "substitution_quality_condition": {
          "name": "substitution_quality_condition",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "substituted_by": {
          "name": "substituted_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "substituted_at": {
          "name": "substituted_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "substitution_quality_approved_by": {
          "name": "substitution_quality_approved_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "substitution_quality_approved_at": {
          "name": "substitution_quality_approved_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "size_serial": {
          "name": "size_serial",
          "type": "varchar(80)",
          "nullable": true,
          "autoIncrement": false
        },
        "size_label": {
          "name": "size_label",
          "type": "varchar(120)",
          "nullable": true,
          "autoIncrement": false
        },
        "size_conversion": {
          "name": "size_conversion",
          "type": "decimal(18,6)",
          "nullable": false,
          "autoIncrement": false
        },
        "planned_quantity": {
          "name": "planned_quantity",
          "type": "decimal(18,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "actual_quantity": {
          "name": "actual_quantity",
          "type": "decimal(18,3)",
          "nullable": true,
          "autoIncrement": false
        },
        "usable_quantity": {
          "name": "usable_quantity",
          "type": "decimal(18,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "scrap_quantity": {
          "name": "scrap_quantity",
          "type": "decimal(18,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_cost": {
          "name": "unit_cost",
          "type": "decimal(18,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "standard_unit_cost": {
          "name": "standard_unit_cost",
          "type": "decimal(18,6)",
          "nullable": true,
          "autoIncrement": false
        },
        "actual_unit_cost": {
          "name": "actual_unit_cost",
          "type": "decimal(18,6)",
          "nullable": true,
          "autoIncrement": false
        },
        "is_backflush": {
          "name": "is_backflush",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "sequence": {
          "name": "sequence",
          "type": "smallint(5)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_order_operations": {
      "name": "manufacturing_order_operations",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "order_id": {
          "name": "order_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "routing_operation_id": {
          "name": "routing_operation_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "sequence": {
          "name": "sequence",
          "type": "smallint(5)",
          "nullable": false,
          "autoIncrement": false
        },
        "operation_code": {
          "name": "operation_code",
          "type": "varchar(30)",
          "nullable": false,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(150)",
          "nullable": false,
          "autoIncrement": false
        },
        "work_instruction_id": {
          "name": "work_instruction_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "instruction_snapshot": {
          "name": "instruction_snapshot",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "planned_setup_minutes": {
          "name": "planned_setup_minutes",
          "type": "decimal(12,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "planned_run_minutes": {
          "name": "planned_run_minutes",
          "type": "decimal(12,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "planned_machine_minutes": {
          "name": "planned_machine_minutes",
          "type": "decimal(12,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "planned_labor_minutes": {
          "name": "planned_labor_minutes",
          "type": "decimal(12,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "actual_minutes": {
          "name": "actual_minutes",
          "type": "decimal(12,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "actual_machine_minutes": {
          "name": "actual_machine_minutes",
          "type": "decimal(12,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "actual_labor_minutes": {
          "name": "actual_labor_minutes",
          "type": "decimal(12,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "good_quantity": {
          "name": "good_quantity",
          "type": "decimal(18,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "scrap_quantity": {
          "name": "scrap_quantity",
          "type": "decimal(18,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "rework_quantity": {
          "name": "rework_quantity",
          "type": "decimal(18,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "is_quality_hold_point": {
          "name": "is_quality_hold_point",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "last_quality_decision": {
          "name": "last_quality_decision",
          "type": "varchar(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "enum('pending','ready','in_progress','held','completed','skipped')",
          "nullable": false,
          "autoIncrement": false
        },
        "started_at": {
          "name": "started_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "completed_at": {
          "name": "completed_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "operator_id": {
          "name": "operator_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "quality_decided_at": {
          "name": "quality_decided_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "quality_decided_by": {
          "name": "quality_decided_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_order_utility_readings": {
      "name": "manufacturing_order_utility_readings",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "order_id": {
          "name": "order_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "utility_type": {
          "name": "utility_type",
          "type": "enum('electricity','water')",
          "nullable": false,
          "autoIncrement": false
        },
        "start_reading": {
          "name": "start_reading",
          "type": "decimal(18,6)",
          "nullable": false,
          "autoIncrement": false
        },
        "end_reading": {
          "name": "end_reading",
          "type": "decimal(18,6)",
          "nullable": false,
          "autoIncrement": false
        },
        "consumption": {
          "name": "consumption",
          "type": "decimal(18,6)",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_rate_snapshot": {
          "name": "unit_rate_snapshot",
          "type": "decimal(18,6)",
          "nullable": false,
          "autoIncrement": false
        },
        "total_cost": {
          "name": "total_cost",
          "type": "decimal(18,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "credit_account_id_snapshot": {
          "name": "credit_account_id_snapshot",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "cost_center_tag_id": {
          "name": "cost_center_tag_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_by": {
          "name": "created_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_outbox": {
      "name": "manufacturing_outbox",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "event_id": {
          "name": "event_id",
          "type": "char(36)",
          "nullable": false,
          "autoIncrement": false
        },
        "correlation_id": {
          "name": "correlation_id",
          "type": "char(36)",
          "nullable": false,
          "autoIncrement": false
        },
        "event_type": {
          "name": "event_type",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "aggregate_type": {
          "name": "aggregate_type",
          "type": "varchar(50)",
          "nullable": false,
          "autoIncrement": false
        },
        "aggregate_id": {
          "name": "aggregate_id",
          "type": "varchar(80)",
          "nullable": false,
          "autoIncrement": false
        },
        "payload": {
          "name": "payload",
          "type": "longtext",
          "nullable": false,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "enum('pending','processing','published','failed','dead')",
          "nullable": false,
          "autoIncrement": false
        },
        "attempts": {
          "name": "attempts",
          "type": "tinyint(3)",
          "nullable": false,
          "autoIncrement": false
        },
        "available_at": {
          "name": "available_at",
          "type": "timestamp",
          "nullable": false,
          "autoIncrement": false
        },
        "published_at": {
          "name": "published_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "last_error": {
          "name": "last_error",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_quality_inspections": {
      "name": "manufacturing_quality_inspections",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "inspection_number": {
          "name": "inspection_number",
          "type": "varchar(40)",
          "nullable": false,
          "autoIncrement": false
        },
        "correlation_id": {
          "name": "correlation_id",
          "type": "char(36)",
          "nullable": false,
          "autoIncrement": false
        },
        "order_id": {
          "name": "order_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "order_operation_id": {
          "name": "order_operation_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "batch_number": {
          "name": "batch_number",
          "type": "varchar(80)",
          "nullable": true,
          "autoIncrement": false
        },
        "characteristic": {
          "name": "characteristic",
          "type": "varchar(120)",
          "nullable": false,
          "autoIncrement": false
        },
        "measured_value": {
          "name": "measured_value",
          "type": "decimal(18,6)",
          "nullable": true,
          "autoIncrement": false
        },
        "lower_limit": {
          "name": "lower_limit",
          "type": "decimal(18,6)",
          "nullable": true,
          "autoIncrement": false
        },
        "upper_limit": {
          "name": "upper_limit",
          "type": "decimal(18,6)",
          "nullable": true,
          "autoIncrement": false
        },
        "is_critical": {
          "name": "is_critical",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "result": {
          "name": "result",
          "type": "enum('pending','pass','fail')",
          "nullable": false,
          "autoIncrement": false
        },
        "usage_decision": {
          "name": "usage_decision",
          "type": "enum('pending','accept','hold','reject','rework','concession')",
          "nullable": false,
          "autoIncrement": false
        },
        "inspected_by": {
          "name": "inspected_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "decided_by": {
          "name": "decided_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "inspected_at": {
          "name": "inspected_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "decided_at": {
          "name": "decided_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "decision_reason": {
          "name": "decision_reason",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "concession_expires_at": {
          "name": "concession_expires_at",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "disposition_quantity": {
          "name": "disposition_quantity",
          "type": "decimal(18,3)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_release_checks": {
      "name": "manufacturing_release_checks",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "order_id": {
          "name": "order_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "check_code": {
          "name": "check_code",
          "type": "varchar(40)",
          "nullable": false,
          "autoIncrement": false
        },
        "result": {
          "name": "result",
          "type": "enum('pass','warning','fail')",
          "nullable": false,
          "autoIncrement": false
        },
        "message": {
          "name": "message",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "override_reason": {
          "name": "override_reason",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "checked_by": {
          "name": "checked_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "approved_by": {
          "name": "approved_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "checked_at": {
          "name": "checked_at",
          "type": "timestamp",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_routings": {
      "name": "manufacturing_routings",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "varchar(40)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "version": {
          "name": "version",
          "type": "varchar(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "effective_from": {
          "name": "effective_from",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        },
        "effective_to": {
          "name": "effective_to",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "enum('draft','active','inactive')",
          "nullable": false,
          "autoIncrement": false
        },
        "created_by": {
          "name": "created_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "approved_by": {
          "name": "approved_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "approved_at": {
          "name": "approved_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_routing_operations": {
      "name": "manufacturing_routing_operations",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "routing_id": {
          "name": "routing_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "sequence": {
          "name": "sequence",
          "type": "smallint(5)",
          "nullable": false,
          "autoIncrement": false
        },
        "operation_code": {
          "name": "operation_code",
          "type": "varchar(30)",
          "nullable": false,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(150)",
          "nullable": false,
          "autoIncrement": false
        },
        "work_instruction_id": {
          "name": "work_instruction_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "setup_minutes": {
          "name": "setup_minutes",
          "type": "decimal(12,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "machine_minutes": {
          "name": "machine_minutes",
          "type": "decimal(12,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "labor_minutes": {
          "name": "labor_minutes",
          "type": "decimal(12,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "queue_minutes": {
          "name": "queue_minutes",
          "type": "decimal(12,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "move_minutes": {
          "name": "move_minutes",
          "type": "decimal(12,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "is_confirmation_point": {
          "name": "is_confirmation_point",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "is_quality_hold_point": {
          "name": "is_quality_hold_point",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "instructions": {
          "name": "instructions",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_sequences": {
      "name": "manufacturing_sequences",
      "columns": {
        "key": {
          "name": "key",
          "type": "varchar(50)",
          "nullable": false,
          "autoIncrement": false
        },
        "next_value": {
          "name": "next_value",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_shifts": {
      "name": "manufacturing_shifts",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "varchar(40)",
          "nullable": false,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(150)",
          "nullable": false,
          "autoIncrement": false
        },
        "start_time": {
          "name": "start_time",
          "type": "time",
          "nullable": false,
          "autoIncrement": false
        },
        "end_time": {
          "name": "end_time",
          "type": "time",
          "nullable": false,
          "autoIncrement": false
        },
        "break_minutes": {
          "name": "break_minutes",
          "type": "smallint(5)",
          "nullable": false,
          "autoIncrement": false
        },
        "efficiency_percent": {
          "name": "efficiency_percent",
          "type": "decimal(5,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost_factor": {
          "name": "cost_factor",
          "type": "decimal(10,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "working_days": {
          "name": "working_days",
          "type": "longtext",
          "nullable": false,
          "autoIncrement": false
        },
        "is_active": {
          "name": "is_active",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_by": {
          "name": "created_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_workers": {
      "name": "manufacturing_workers",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "user_id": {
          "name": "user_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "labor_category_id": {
          "name": "labor_category_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "base_hourly_rate": {
          "name": "base_hourly_rate",
          "type": "decimal(18,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "is_active": {
          "name": "is_active",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_workspace_records": {
      "name": "manufacturing_workspace_records",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "screen_key": {
          "name": "screen_key",
          "type": "varchar(80)",
          "nullable": false,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "varchar(60)",
          "nullable": false,
          "autoIncrement": false
        },
        "title": {
          "name": "title",
          "type": "varchar(190)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "owner_id": {
          "name": "owner_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "enum('draft','submitted','approved','active','closed','rejected')",
          "nullable": false,
          "autoIncrement": false
        },
        "priority": {
          "name": "priority",
          "type": "tinyint(3)",
          "nullable": false,
          "autoIncrement": false
        },
        "effective_from": {
          "name": "effective_from",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "effective_to": {
          "name": "effective_to",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "data": {
          "name": "data",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "created_by": {
          "name": "created_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "approved_by": {
          "name": "approved_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "submitted_at": {
          "name": "submitted_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "approved_at": {
          "name": "approved_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "manufacturing_work_instructions": {
      "name": "manufacturing_work_instructions",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "varchar(40)",
          "nullable": false,
          "autoIncrement": false
        },
        "version": {
          "name": "version",
          "type": "varchar(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "title": {
          "name": "title",
          "type": "varchar(150)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "effective_from": {
          "name": "effective_from",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        },
        "effective_to": {
          "name": "effective_to",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "instructions": {
          "name": "instructions",
          "type": "longtext",
          "nullable": false,
          "autoIncrement": false
        },
        "requires_acknowledgement": {
          "name": "requires_acknowledgement",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "is_active": {
          "name": "is_active",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_by": {
          "name": "created_by",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "migrations": {
      "name": "migrations",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "migration": {
          "name": "migration",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "batch": {
          "name": "batch",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "movement_assets": {
      "name": "movement_assets",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "asset_id": {
          "name": "asset_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "move_type": {
          "name": "move_type",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "deprecation": {
          "name": "deprecation",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "cat_id": {
          "name": "cat_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "notifications": {
      "name": "notifications",
      "columns": {
        "id": {
          "name": "id",
          "type": "char(36)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "notifiable_type": {
          "name": "notifiable_type",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "notifiable_id": {
          "name": "notifiable_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "data": {
          "name": "data",
          "type": "text",
          "nullable": false,
          "autoIncrement": false
        },
        "read_at": {
          "name": "read_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "nozzels": {
      "name": "nozzels",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "nozzele_name": {
          "name": "nozzele_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "nozzele_id": {
          "name": "nozzele_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "pump_id": {
          "name": "pump_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "opening_balance": {
      "name": "opening_balance",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(100)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "opening_balance_2025": {
      "name": "opening_balance_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(100)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "opening_balance_details": {
      "name": "opening_balance_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "opening_balance_id": {
          "name": "opening_balance_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "inv_quantity": {
          "name": "inv_quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(100)",
          "nullable": true,
          "autoIncrement": false
        },
        "c_quantity": {
          "name": "c_quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "c_inv_quantity": {
          "name": "c_inv_quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "opening_balance_details_2025": {
      "name": "opening_balance_details_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "opening_balance_id": {
          "name": "opening_balance_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "inv_quantity": {
          "name": "inv_quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(100)",
          "nullable": true,
          "autoIncrement": false
        },
        "c_quantity": {
          "name": "c_quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "c_inv_quantity": {
          "name": "c_inv_quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "opening_bills": {
      "name": "opening_bills",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "opening_bills_2025": {
      "name": "opening_bills_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "opening_bill_details": {
      "name": "opening_bill_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "opening_bill_id": {
          "name": "opening_bill_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "bill_id": {
          "name": "bill_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "paid": {
          "name": "paid",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "remain": {
          "name": "remain",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "opening_bill_details_2025": {
      "name": "opening_bill_details_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "opening_bill_id": {
          "name": "opening_bill_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "bill_id": {
          "name": "bill_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "paid": {
          "name": "paid",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "remain": {
          "name": "remain",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "openning_assets": {
      "name": "openning_assets",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "total_deprection": {
          "name": "total_deprection",
          "type": "decimal(8,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "total_amount": {
          "name": "total_amount",
          "type": "decimal(8,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "openning_asset_details": {
      "name": "openning_asset_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "openning_asset_id": {
          "name": "openning_asset_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_price": {
          "name": "unit_price",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "total_price": {
          "name": "total_price",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_deprection": {
          "name": "unit_deprection",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "total_deprection": {
          "name": "total_deprection",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "orders_offers": {
      "name": "orders_offers",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "bol": {
          "name": "bol",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount": {
          "name": "discount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_type": {
          "name": "discount_type",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "paid": {
          "name": "paid",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "remain": {
          "name": "remain",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "count_submit": {
          "name": "count_submit",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "bill_id": {
          "name": "bill_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "ref_number": {
          "name": "ref_number",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "otp": {
          "name": "otp",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "orders_offers_2025": {
      "name": "orders_offers_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "bol": {
          "name": "bol",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount": {
          "name": "discount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_type": {
          "name": "discount_type",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "paid": {
          "name": "paid",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "remain": {
          "name": "remain",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "count_submit": {
          "name": "count_submit",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "bill_id": {
          "name": "bill_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "ref_number": {
          "name": "ref_number",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "otp": {
          "name": "otp",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "orders_offers_details": {
      "name": "orders_offers_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "bill_id": {
          "name": "bill_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "total_price": {
          "name": "total_price",
          "type": "double(8,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_price": {
          "name": "unit_price",
          "type": "double(8,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "expire_date": {
          "name": "expire_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "discount_quantity": {
          "name": "discount_quantity",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "orders_offers_details_2025": {
      "name": "orders_offers_details_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "bill_id": {
          "name": "bill_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "total_price": {
          "name": "total_price",
          "type": "double(8,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_price": {
          "name": "unit_price",
          "type": "double(8,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "expire_date": {
          "name": "expire_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "discount_quantity": {
          "name": "discount_quantity",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "order_deliveries": {
      "name": "order_deliveries",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "time",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "ref_number": {
          "name": "ref_number",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "sub_total": {
          "name": "sub_total",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount": {
          "name": "discount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "paid": {
          "name": "paid",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "bol": {
          "name": "bol",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "remain": {
          "name": "remain",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "approved": {
          "name": "approved",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "enum('pending','confirmed','cancelled','in_delivery','delivered','postponed')",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "order_deliveries_2025": {
      "name": "order_deliveries_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "time",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "ref_number": {
          "name": "ref_number",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "sub_total": {
          "name": "sub_total",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount": {
          "name": "discount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "paid": {
          "name": "paid",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "bol": {
          "name": "bol",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "remain": {
          "name": "remain",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "approved": {
          "name": "approved",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "enum('pending','confirmed','cancelled','in_delivery','delivered','postponed')",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "order_delivery_details": {
      "name": "order_delivery_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "order_delivery_id": {
          "name": "order_delivery_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "total_price": {
          "name": "total_price",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_price": {
          "name": "unit_price",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "expire_date": {
          "name": "expire_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "sales_quantity": {
          "name": "sales_quantity",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "length": {
          "name": "length",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "properties": {
          "name": "properties",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "order_delivery_details_2025": {
      "name": "order_delivery_details_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "order_delivery_id": {
          "name": "order_delivery_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "total_price": {
          "name": "total_price",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_price": {
          "name": "unit_price",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "expire_date": {
          "name": "expire_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "sales_quantity": {
          "name": "sales_quantity",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "length": {
          "name": "length",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "properties": {
          "name": "properties",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "pack_products": {
      "name": "pack_products",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "unit": {
          "name": "unit",
          "type": "varchar(50)",
          "nullable": true,
          "autoIncrement": false
        },
        "pack": {
          "name": "pack",
          "type": "varchar(50)",
          "nullable": true,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "state": {
          "name": "state",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "main": {
          "name": "main",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "description": {
          "name": "description",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "unit_en": {
          "name": "unit_en",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "pages": {
      "name": "pages",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "name_ar": {
          "name": "name_ar",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "name_en": {
          "name": "name_en",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "url": {
          "name": "url",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "icon": {
          "name": "icon",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "active": {
          "name": "active",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "paid_bills": {
      "name": "paid_bills",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "supplier_id": {
          "name": "supplier_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "purchase_id": {
          "name": "purchase_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "accounting_id": {
          "name": "accounting_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "commission": {
          "name": "commission",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_on_commission": {
          "name": "tax_on_commission",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "attachment": {
          "name": "attachment",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "approved": {
          "name": "approved",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "cost_center_tag_id": {
          "name": "cost_center_tag_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "paid_on_bills": {
      "name": "paid_on_bills",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "paymentmethod_id": {
          "name": "paymentmethod_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "bill_id": {
          "name": "bill_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "paid_on_bills_2025": {
      "name": "paid_on_bills_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "paymentmethod_id": {
          "name": "paymentmethod_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "bill_id": {
          "name": "bill_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "paid_on_bills_pending": {
      "name": "paid_on_bills_pending",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "paymentmethod_id": {
          "name": "paymentmethod_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "bill_id": {
          "name": "bill_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "paid_on_bills_pending_2025": {
      "name": "paid_on_bills_pending_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "paymentmethod_id": {
          "name": "paymentmethod_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "bill_id": {
          "name": "bill_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "paid_on_orders_offers": {
      "name": "paid_on_orders_offers",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "paymentmethod_id": {
          "name": "paymentmethod_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "order_offer_id": {
          "name": "order_offer_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "paid_on_orders_offers_2020": {
      "name": "paid_on_orders_offers_2020",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "paymentmethod_id": {
          "name": "paymentmethod_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "order_offer_id": {
          "name": "order_offer_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "paid_on_orders_offers_2021": {
      "name": "paid_on_orders_offers_2021",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "paymentmethod_id": {
          "name": "paymentmethod_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "order_offer_id": {
          "name": "order_offer_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "paid_on_orders_offers_2022": {
      "name": "paid_on_orders_offers_2022",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "paymentmethod_id": {
          "name": "paymentmethod_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "order_offer_id": {
          "name": "order_offer_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "paid_on_orders_offers_2023": {
      "name": "paid_on_orders_offers_2023",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "paymentmethod_id": {
          "name": "paymentmethod_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "order_offer_id": {
          "name": "order_offer_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "paid_on_orders_offers_2024": {
      "name": "paid_on_orders_offers_2024",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "paymentmethod_id": {
          "name": "paymentmethod_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "order_offer_id": {
          "name": "order_offer_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "paid_on_orders_offers_2025": {
      "name": "paid_on_orders_offers_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "paymentmethod_id": {
          "name": "paymentmethod_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "order_offer_id": {
          "name": "order_offer_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "paid_on_purchases": {
      "name": "paid_on_purchases",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "paymentmethod_id": {
          "name": "paymentmethod_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "purchase_id": {
          "name": "purchase_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "paid_on_purchases_2020": {
      "name": "paid_on_purchases_2020",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "paymentmethod_id": {
          "name": "paymentmethod_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "purchase_id": {
          "name": "purchase_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "paid_on_purchases_2021": {
      "name": "paid_on_purchases_2021",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "paymentmethod_id": {
          "name": "paymentmethod_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "purchase_id": {
          "name": "purchase_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "paid_on_purchases_2022": {
      "name": "paid_on_purchases_2022",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "paymentmethod_id": {
          "name": "paymentmethod_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "purchase_id": {
          "name": "purchase_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "paid_on_purchases_2023": {
      "name": "paid_on_purchases_2023",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "paymentmethod_id": {
          "name": "paymentmethod_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "purchase_id": {
          "name": "purchase_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "paid_on_purchases_2024": {
      "name": "paid_on_purchases_2024",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "paymentmethod_id": {
          "name": "paymentmethod_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "purchase_id": {
          "name": "purchase_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "paid_on_purchases_2025": {
      "name": "paid_on_purchases_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "paymentmethod_id": {
          "name": "paymentmethod_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "purchase_id": {
          "name": "purchase_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "paid_on_purchases_2026": {
      "name": "paid_on_purchases_2026",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "paymentmethod_id": {
          "name": "paymentmethod_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "purchase_id": {
          "name": "purchase_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "paid_on_purchases_2027": {
      "name": "paid_on_purchases_2027",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "paymentmethod_id": {
          "name": "paymentmethod_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "purchase_id": {
          "name": "purchase_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "paid_opening_bills": {
      "name": "paid_opening_bills",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "cash_receipt_id": {
          "name": "cash_receipt_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "bill_id": {
          "name": "bill_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "paid_amount": {
          "name": "paid_amount",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "remain": {
          "name": "remain",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "paid_opening_bills_2025": {
      "name": "paid_opening_bills_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "cash_receipt_id": {
          "name": "cash_receipt_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "bill_id": {
          "name": "bill_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "paid_amount": {
          "name": "paid_amount",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "remain": {
          "name": "remain",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "paid_purchase_details": {
      "name": "paid_purchase_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "paid_bill_id": {
          "name": "paid_bill_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "purchase_id": {
          "name": "purchase_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "paid_purchase_details_2025": {
      "name": "paid_purchase_details_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "paid_bill_id": {
          "name": "paid_bill_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "purchase_id": {
          "name": "purchase_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "password_resets": {
      "name": "password_resets",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "email": {
          "name": "email",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "token": {
          "name": "token",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "patches": {
      "name": "patches",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "quantity_type": {
          "name": "quantity_type",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "link_id": {
          "name": "link_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_price": {
          "name": "unit_price",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "total_price": {
          "name": "total_price",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "atc": {
          "name": "atc",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "patch_code": {
          "name": "patch_code",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost": {
          "name": "cost",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "payment_methods": {
      "name": "payment_methods",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "name_en": {
          "name": "name_en",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "accounting_id": {
          "name": "accounting_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "account_id_sales": {
          "name": "account_id_sales",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "commission": {
          "name": "commission",
          "type": "decimal(15,6)",
          "nullable": false,
          "autoIncrement": false
        },
        "show_in_fund": {
          "name": "show_in_fund",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "automatic_paid_receipt": {
          "name": "automatic_paid_receipt",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "payment_type": {
          "name": "payment_type",
          "type": "enum('cash','bank','online','other')",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "payment_types": {
      "name": "payment_types",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "slug": {
          "name": "slug",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "phases": {
      "name": "phases",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "task_id": {
          "name": "task_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "actual_cost": {
          "name": "actual_cost",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "expected_cost": {
          "name": "expected_cost",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "expected_end_time": {
          "name": "expected_end_time",
          "type": "datetime",
          "nullable": true,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "description": {
          "name": "description",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "places": {
      "name": "places",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "varchar(155)",
          "nullable": true,
          "autoIncrement": false
        },
        "parent_id": {
          "name": "parent_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "system_type": {
          "name": "system_type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "name_en": {
          "name": "name_en",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "latitude": {
          "name": "latitude",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "longitude": {
          "name": "longitude",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "map_address": {
          "name": "map_address",
          "type": "varchar(100)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "Poultry_farming_barns": {
      "name": "Poultry_farming_barns",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "name_en": {
          "name": "name_en",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "poultry_farming_cycles": {
      "name": "poultry_farming_cycles",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "cycle_code": {
          "name": "cycle_code",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_serial": {
          "name": "branch_serial",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "from_date": {
          "name": "from_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "to_date": {
          "name": "to_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "total_quantity": {
          "name": "total_quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost": {
          "name": "cost",
          "type": "decimal(10,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "decimal(10,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_account_id": {
          "name": "gl_account_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "approvemanager": {
          "name": "approvemanager",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "need_close": {
          "name": "need_close",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "poultry_farming_cycle_deads": {
      "name": "poultry_farming_cycle_deads",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "poultry_farming_cycle_id": {
          "name": "poultry_farming_cycle_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "poultry_farming_cycle_details_id": {
          "name": "poultry_farming_cycle_details_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        },
        "closed_date": {
          "name": "closed_date",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "journal_id": {
          "name": "journal_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "poultry_farming_cycle_details": {
      "name": "poultry_farming_cycle_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "poultry_farming_cycle_id": {
          "name": "poultry_farming_cycle_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "is_finished": {
          "name": "is_finished",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "poultry_farming_cycle_weights": {
      "name": "poultry_farming_cycle_weights",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "poultry_farming_cycle_id": {
          "name": "poultry_farming_cycle_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "poultry_farming_cycle_details_id": {
          "name": "poultry_farming_cycle_details_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        },
        "sample_weight": {
          "name": "sample_weight",
          "type": "decimal(10,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "sample_count": {
          "name": "sample_count",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "average_weight": {
          "name": "average_weight",
          "type": "decimal(10,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "price_list": {
      "name": "price_list",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "category_id": {
          "name": "category_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "active": {
          "name": "active",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "region_id": {
          "name": "region_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "customer_group_id": {
          "name": "customer_group_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "price_list_customers": {
      "name": "price_list_customers",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "list_id": {
          "name": "list_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "price_list_details": {
      "name": "price_list_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "price_list_id": {
          "name": "price_list_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "size_id": {
          "name": "size_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "price": {
          "name": "price",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "min_price": {
          "name": "min_price",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "manager_min_price": {
          "name": "manager_min_price",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "supervisor_min_price": {
          "name": "supervisor_min_price",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "price_ranges": {
      "name": "price_ranges",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "branch": {
          "name": "branch",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate": {
          "name": "delegate",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "varchar(50)",
          "nullable": true,
          "autoIncrement": false
        },
        "from_quantity": {
          "name": "from_quantity",
          "type": "double(8,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "to_quantity": {
          "name": "to_quantity",
          "type": "double(8,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "price": {
          "name": "price",
          "type": "double(8,2)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "productioncollections": {
      "name": "productioncollections",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "from_store": {
          "name": "from_store",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "to_store": {
          "name": "to_store",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "totaloutquantity": {
          "name": "totaloutquantity",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "attachment": {
          "name": "attachment",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "productioncollections_2025": {
      "name": "productioncollections_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "from_store": {
          "name": "from_store",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "to_store": {
          "name": "to_store",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "totaloutquantity": {
          "name": "totaloutquantity",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "attachment": {
          "name": "attachment",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "productioncollection_costs": {
      "name": "productioncollection_costs",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "productioncollection_id": {
          "name": "productioncollection_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost_id": {
          "name": "cost_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost_value": {
          "name": "cost_value",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "cost": {
          "name": "cost",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "supplier_id": {
          "name": "supplier_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "without_tax": {
          "name": "without_tax",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "productioncollection_costs_2025": {
      "name": "productioncollection_costs_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "productioncollection_id": {
          "name": "productioncollection_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost_id": {
          "name": "cost_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost_value": {
          "name": "cost_value",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "cost": {
          "name": "cost",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "supplier_id": {
          "name": "supplier_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "without_tax": {
          "name": "without_tax",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "productioncollection_damages": {
      "name": "productioncollection_damages",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "productioncollection_id": {
          "name": "productioncollection_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "productioncollection_damages_2025": {
      "name": "productioncollection_damages_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "productioncollection_id": {
          "name": "productioncollection_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "productioncollection_details": {
      "name": "productioncollection_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "productioncollection_id": {
          "name": "productioncollection_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "productioncollection_details_2025": {
      "name": "productioncollection_details_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "productioncollection_id": {
          "name": "productioncollection_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "productioncollection_gp_details": {
      "name": "productioncollection_gp_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "order_id": {
          "name": "order_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "expiredate": {
          "name": "expiredate",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "productioncollection_packagings": {
      "name": "productioncollection_packagings",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "productioncollection_id": {
          "name": "productioncollection_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "productioncollection_packagings_2025": {
      "name": "productioncollection_packagings_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "productioncollection_id": {
          "name": "productioncollection_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "double(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "products": {
      "name": "products",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "barcode": {
          "name": "barcode",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(200)",
          "nullable": false,
          "autoIncrement": false
        },
        "name_en": {
          "name": "name_en",
          "type": "varchar(200)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost": {
          "name": "cost",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "price": {
          "name": "price",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "info": {
          "name": "info",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "info_en": {
          "name": "info_en",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "photo": {
          "name": "photo",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "s_cat_id": {
          "name": "s_cat_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "m_cat_id": {
          "name": "m_cat_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "productType": {
          "name": "productType",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "min_quantity": {
          "name": "min_quantity",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "taxvalue_id": {
          "name": "taxvalue_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "active": {
          "name": "active",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "dont_allow_return": {
          "name": "dont_allow_return",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_account_id": {
          "name": "product_account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "system_type": {
          "name": "system_type",
          "type": "tinyint(3)",
          "nullable": false,
          "autoIncrement": false
        },
        "color": {
          "name": "color",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "show_pieces_count": {
          "name": "show_pieces_count",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "products_by_customer_categories": {
      "name": "products_by_customer_categories",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "category_ids": {
          "name": "category_ids",
          "type": "longtext",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "products_g_details": {
      "name": "products_g_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "group_id": {
          "name": "group_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "price": {
          "name": "price",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "total_price": {
          "name": "total_price",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "products_g_orders": {
      "name": "products_g_orders",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "total_cost": {
          "name": "total_cost",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "total_price": {
          "name": "total_price",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "to_store_id": {
          "name": "to_store_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "totaloutquantity": {
          "name": "totaloutquantity",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "attachment": {
          "name": "attachment",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "products_g_orders_2025": {
      "name": "products_g_orders_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "total_cost": {
          "name": "total_cost",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "total_price": {
          "name": "total_price",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "to_store_id": {
          "name": "to_store_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "totaloutquantity": {
          "name": "totaloutquantity",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "attachment": {
          "name": "attachment",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "products_g_order_additions": {
      "name": "products_g_order_additions",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "order_id": {
          "name": "order_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "prod_type": {
          "name": "prod_type",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "cost": {
          "name": "cost",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "price": {
          "name": "price",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "products_g_order_additions_2025": {
      "name": "products_g_order_additions_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "order_id": {
          "name": "order_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "prod_type": {
          "name": "prod_type",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "cost": {
          "name": "cost",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "price": {
          "name": "price",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "products_g_order_costs": {
      "name": "products_g_order_costs",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "order_id": {
          "name": "order_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost_id": {
          "name": "cost_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost_value": {
          "name": "cost_value",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "cost": {
          "name": "cost",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "supplier_id": {
          "name": "supplier_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "without_tax": {
          "name": "without_tax",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "products_g_order_costs_2025": {
      "name": "products_g_order_costs_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "order_id": {
          "name": "order_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost_id": {
          "name": "cost_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost_value": {
          "name": "cost_value",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "cost": {
          "name": "cost",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "supplier_id": {
          "name": "supplier_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "without_tax": {
          "name": "without_tax",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "products_g_order_details": {
      "name": "products_g_order_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "order_id": {
          "name": "order_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "group_id": {
          "name": "group_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "expire_date": {
          "name": "expire_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "products_g_order_details_2025": {
      "name": "products_g_order_details_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "order_id": {
          "name": "order_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "group_id": {
          "name": "group_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "expire_date": {
          "name": "expire_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "products_g_order_packagings": {
      "name": "products_g_order_packagings",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "order_id": {
          "name": "order_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "products_g_order_packagings_2025": {
      "name": "products_g_order_packagings_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "order_id": {
          "name": "order_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "double(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "product_accounts": {
      "name": "product_accounts",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name_en": {
          "name": "name_en",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "name_ar": {
          "name": "name_ar",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "price": {
          "name": "price",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "m_cat_id": {
          "name": "m_cat_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "account_id": {
          "name": "account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "product_colors": {
      "name": "product_colors",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "hex_code": {
          "name": "hex_code",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "product_g_orders_items": {
      "name": "product_g_orders_items",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "order_id": {
          "name": "order_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "product_g_orders_items_2025": {
      "name": "product_g_orders_items_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "order_id": {
          "name": "order_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "double(8,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "product_sizes": {
      "name": "product_sizes",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "profit_forms": {
      "name": "profit_forms",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "account_id": {
          "name": "account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "cid": {
          "name": "cid",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "tid": {
          "name": "tid",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "order": {
          "name": "order",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "projects": {
      "name": "projects",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "person_name": {
          "name": "person_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "start_date": {
          "name": "start_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "end_date": {
          "name": "end_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "expected_cost": {
          "name": "expected_cost",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "description": {
          "name": "description",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "projects_details": {
      "name": "projects_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "project_id": {
          "name": "project_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "stage_name": {
          "name": "stage_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "description": {
          "name": "description",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "attach": {
          "name": "attach",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "purchases": {
      "name": "purchases",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "supplier_id": {
          "name": "supplier_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "sub_total": {
          "name": "sub_total",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "add_cost": {
          "name": "add_cost",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "paid": {
          "name": "paid",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "remain": {
          "name": "remain",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "cost_center_id": {
          "name": "cost_center_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "reference": {
          "name": "reference",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "offer_id": {
          "name": "offer_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "exciseTax": {
          "name": "exciseTax",
          "type": "decimal(15,0)",
          "nullable": true,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount": {
          "name": "discount",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_type": {
          "name": "discount_type",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "memo": {
          "name": "memo",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "approved": {
          "name": "approved",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "attachment": {
          "name": "attachment",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_by": {
          "name": "created_by",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "without_receipt": {
          "name": "without_receipt",
          "type": "tinyint(4)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "purchasesexcel": {
      "name": "purchasesexcel",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_date": {
          "name": "invoice_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_code": {
          "name": "product_code",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "warehouse_code": {
          "name": "warehouse_code",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "billed_qty_ct": {
          "name": "billed_qty_ct",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "billed_qty_un": {
          "name": "billed_qty_un",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "billed_value": {
          "name": "billed_value",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "price": {
          "name": "price",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_1": {
          "name": "tax_1",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "actual_qty_ct": {
          "name": "actual_qty_ct",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "actual_qty_un": {
          "name": "actual_qty_un",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "actual_value": {
          "name": "actual_value",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "shortage_qty_ct": {
          "name": "shortage_qty_ct",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "shortage_qty_un": {
          "name": "shortage_qty_un",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "shortage_value": {
          "name": "shortage_value",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "purchases_2025": {
      "name": "purchases_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "supplier_id": {
          "name": "supplier_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "sub_total": {
          "name": "sub_total",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "add_cost": {
          "name": "add_cost",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "paid": {
          "name": "paid",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "remain": {
          "name": "remain",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "cost_center_id": {
          "name": "cost_center_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "reference": {
          "name": "reference",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "offer_id": {
          "name": "offer_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "exciseTax": {
          "name": "exciseTax",
          "type": "decimal(15,0)",
          "nullable": true,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount": {
          "name": "discount",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_type": {
          "name": "discount_type",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "memo": {
          "name": "memo",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "approved": {
          "name": "approved",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "attachment": {
          "name": "attachment",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_by": {
          "name": "created_by",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "without_receipt": {
          "name": "without_receipt",
          "type": "tinyint(4)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "purchases_details": {
      "name": "purchases_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "purchase_id": {
          "name": "purchase_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "price": {
          "name": "price",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_price": {
          "name": "unit_price",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(1000)",
          "nullable": false,
          "autoIncrement": false
        },
        "expire_date": {
          "name": "expire_date",
          "type": "varchar(50)",
          "nullable": true,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "production_date": {
          "name": "production_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "exciseTax": {
          "name": "exciseTax",
          "type": "double(8,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "discount_quantity": {
          "name": "discount_quantity",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "item_discount_value": {
          "name": "item_discount_value",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "total_item_discount": {
          "name": "total_item_discount",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "item_tax_rate": {
          "name": "item_tax_rate",
          "type": "decimal(8,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "item_tax_amount": {
          "name": "item_tax_amount",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "final_total": {
          "name": "final_total",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "shelve_id": {
          "name": "shelve_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "purchases_details_2025": {
      "name": "purchases_details_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "purchase_id": {
          "name": "purchase_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "price": {
          "name": "price",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_price": {
          "name": "unit_price",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(1000)",
          "nullable": false,
          "autoIncrement": false
        },
        "expire_date": {
          "name": "expire_date",
          "type": "varchar(50)",
          "nullable": true,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "production_date": {
          "name": "production_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "exciseTax": {
          "name": "exciseTax",
          "type": "double(8,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "discount_quantity": {
          "name": "discount_quantity",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "item_discount_value": {
          "name": "item_discount_value",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "shelve_id": {
          "name": "shelve_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "purchases_offers": {
      "name": "purchases_offers",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "delivery_date": {
          "name": "delivery_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "supplier_id": {
          "name": "supplier_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "sub_total": {
          "name": "sub_total",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "paid": {
          "name": "paid",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "remain": {
          "name": "remain",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "reference": {
          "name": "reference",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "purchases_order": {
          "name": "purchases_order",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "approved": {
          "name": "approved",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "purchases_offers_2025": {
      "name": "purchases_offers_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "supplier_id": {
          "name": "supplier_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "sub_total": {
          "name": "sub_total",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "paid": {
          "name": "paid",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "remain": {
          "name": "remain",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "reference": {
          "name": "reference",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "purchases_order": {
          "name": "purchases_order",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "approved": {
          "name": "approved",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "purchases_offers_details": {
      "name": "purchases_offers_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "purchase_id": {
          "name": "purchase_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "price": {
          "name": "price",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_price": {
          "name": "unit_price",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "expire_date": {
          "name": "expire_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "production_date": {
          "name": "production_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "purchases_offers_details_2025": {
      "name": "purchases_offers_details_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "purchase_id": {
          "name": "purchase_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "price": {
          "name": "price",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_price": {
          "name": "unit_price",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "expire_date": {
          "name": "expire_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "production_date": {
          "name": "production_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "purchases_returns": {
      "name": "purchases_returns",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "supplier_id": {
          "name": "supplier_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "sub_total": {
          "name": "sub_total",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "paid": {
          "name": "paid",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "remain": {
          "name": "remain",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "reference": {
          "name": "reference",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "offer_id": {
          "name": "offer_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "exciseTax": {
          "name": "exciseTax",
          "type": "decimal(15,0)",
          "nullable": true,
          "autoIncrement": false
        },
        "add_cost": {
          "name": "add_cost",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount": {
          "name": "discount",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_type": {
          "name": "discount_type",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "valid_purchases_id": {
          "name": "valid_purchases_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "attachment": {
          "name": "attachment",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "memo": {
          "name": "memo",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "purchases_returns_2025": {
      "name": "purchases_returns_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "supplier_id": {
          "name": "supplier_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "sub_total": {
          "name": "sub_total",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "paid": {
          "name": "paid",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "remain": {
          "name": "remain",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "reference": {
          "name": "reference",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "offer_id": {
          "name": "offer_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "exciseTax": {
          "name": "exciseTax",
          "type": "decimal(15,0)",
          "nullable": true,
          "autoIncrement": false
        },
        "add_cost": {
          "name": "add_cost",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount": {
          "name": "discount",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "discount_type": {
          "name": "discount_type",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "valid_purchases_id": {
          "name": "valid_purchases_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "attachment": {
          "name": "attachment",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "memo": {
          "name": "memo",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "purchases_returns_details": {
      "name": "purchases_returns_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "purchase_id": {
          "name": "purchase_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "price": {
          "name": "price",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_price": {
          "name": "unit_price",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(1000)",
          "nullable": false,
          "autoIncrement": false
        },
        "expire_date": {
          "name": "expire_date",
          "type": "varchar(50)",
          "nullable": true,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "production_date": {
          "name": "production_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "exciseTax": {
          "name": "exciseTax",
          "type": "double(8,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "discount_quantity": {
          "name": "discount_quantity",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "item_discount_value": {
          "name": "item_discount_value",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "shelve_id": {
          "name": "shelve_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "purchases_returns_details_2025": {
      "name": "purchases_returns_details_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "purchase_id": {
          "name": "purchase_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "price": {
          "name": "price",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_price": {
          "name": "unit_price",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(1000)",
          "nullable": false,
          "autoIncrement": false
        },
        "expire_date": {
          "name": "expire_date",
          "type": "varchar(50)",
          "nullable": true,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "production_date": {
          "name": "production_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "exciseTax": {
          "name": "exciseTax",
          "type": "double(8,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "discount_quantity": {
          "name": "discount_quantity",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "item_discount_value": {
          "name": "item_discount_value",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "shelve_id": {
          "name": "shelve_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "purchase_assets": {
      "name": "purchase_assets",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "reference": {
          "name": "reference",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "credit_account": {
          "name": "credit_account",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "payment_method_account": {
          "name": "payment_method_account",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "purchase_asset_details": {
      "name": "purchase_asset_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "purchase_asset_id": {
          "name": "purchase_asset_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "asset_id": {
          "name": "asset_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "unit_price": {
          "name": "unit_price",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "total_price": {
          "name": "total_price",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "price_asset": {
          "name": "price_asset",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "purchase_costs": {
      "name": "purchase_costs",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "purchase_id": {
          "name": "purchase_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "add_cost_id": {
          "name": "add_cost_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "cost_value": {
          "name": "cost_value",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "total_cost": {
          "name": "total_cost",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "without_tax": {
          "name": "without_tax",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "purchasestype": {
          "name": "purchasestype",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost_on_supplier": {
          "name": "cost_on_supplier",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "purchase_costs_2025": {
      "name": "purchase_costs_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "purchase_id": {
          "name": "purchase_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "add_cost_id": {
          "name": "add_cost_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "cost_value": {
          "name": "cost_value",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "total_cost": {
          "name": "total_cost",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "without_tax": {
          "name": "without_tax",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "purchasestype": {
          "name": "purchasestype",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "purchase_order_costs": {
      "name": "purchase_order_costs",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "purchase_id": {
          "name": "purchase_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "memo": {
          "name": "memo",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "purchase_order_cost_details": {
      "name": "purchase_order_cost_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "purchase_order_cost_id": {
          "name": "purchase_order_cost_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "add_cost_id": {
          "name": "add_cost_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "cost_value": {
          "name": "cost_value",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "total_cost": {
          "name": "total_cost",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "cost_on_supplier": {
          "name": "cost_on_supplier",
          "type": "tinyint(4)",
          "nullable": false,
          "autoIncrement": false
        },
        "without_tax": {
          "name": "without_tax",
          "type": "tinyint(4)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "receipt_permission_attachments_logistics": {
      "name": "receipt_permission_attachments_logistics",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "receipt_permission_logistic_id": {
          "name": "receipt_permission_logistic_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "receipt_permission_delivery_id": {
          "name": "receipt_permission_delivery_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "file_name": {
          "name": "file_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "file_path": {
          "name": "file_path",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "file_type": {
          "name": "file_type",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "file_size": {
          "name": "file_size",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "action_type": {
          "name": "action_type",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "receipt_permission_attachments_logistics_2025": {
      "name": "receipt_permission_attachments_logistics_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "receipt_permission_logistic_id": {
          "name": "receipt_permission_logistic_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "file_name": {
          "name": "file_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "file_path": {
          "name": "file_path",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "file_type": {
          "name": "file_type",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "file_size": {
          "name": "file_size",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "action_type": {
          "name": "action_type",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "receipt_permission_deliveries": {
      "name": "receipt_permission_deliveries",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "receipt_permission_logistic_id": {
          "name": "receipt_permission_logistic_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "to_customer_id": {
          "name": "to_customer_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "to_store_id": {
          "name": "to_store_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "receiver_name": {
          "name": "receiver_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "shipping_cost": {
          "name": "shipping_cost",
          "type": "decimal(10,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "enum('pending','delivered','cancelled')",
          "nullable": false,
          "autoIncrement": false
        },
        "delivery_date": {
          "name": "delivery_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "created_by": {
          "name": "created_by",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "receipt_permission_delivery_details": {
      "name": "receipt_permission_delivery_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "receipt_permission_delivery_id": {
          "name": "receipt_permission_delivery_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(15,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "price": {
          "name": "price",
          "type": "decimal(10,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "decimal(10,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "receipt_permission_details_logistics": {
      "name": "receipt_permission_details_logistics",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "receipt_permission_logistic_id": {
          "name": "receipt_permission_logistic_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "delivered_quantity": {
          "name": "delivered_quantity",
          "type": "decimal(15,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "remaining_quantity": {
          "name": "remaining_quantity",
          "type": "decimal(15,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "price": {
          "name": "price",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "receipt_permission_details_logistics_2025": {
      "name": "receipt_permission_details_logistics_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "receipt_permission_logistic_id": {
          "name": "receipt_permission_logistic_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "price": {
          "name": "price",
          "type": "double(8,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "total": {
          "name": "total",
          "type": "double(8,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "receipt_permission_logistics": {
      "name": "receipt_permission_logistics",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "from_customer_id": {
          "name": "from_customer_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "to_customer_id": {
          "name": "to_customer_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "from_store_id": {
          "name": "from_store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "to_store_id": {
          "name": "to_store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "enum('received','stored','in_delivery','partially_delivered','delivered','cancelled')",
          "nullable": true,
          "autoIncrement": false
        },
        "total_quantity": {
          "name": "total_quantity",
          "type": "decimal(15,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "delivered_quantity": {
          "name": "delivered_quantity",
          "type": "decimal(15,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "remaining_quantity": {
          "name": "remaining_quantity",
          "type": "decimal(15,3)",
          "nullable": false,
          "autoIncrement": false
        },
        "is_approved": {
          "name": "is_approved",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_by": {
          "name": "created_by",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "note": {
          "name": "note",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "created_date": {
          "name": "created_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_date": {
          "name": "updated_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "receiver_name": {
          "name": "receiver_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "shipping_cost": {
          "name": "shipping_cost",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "receipt_permission_logistics_2025": {
      "name": "receipt_permission_logistics_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "from_customer_id": {
          "name": "from_customer_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "to_customer_id": {
          "name": "to_customer_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "from_store_id": {
          "name": "from_store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "to_store_id": {
          "name": "to_store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "enum('received','stored','in_delivery','partially_delivered','delivered','cancelled')",
          "nullable": true,
          "autoIncrement": false
        },
        "created_by": {
          "name": "created_by",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "note": {
          "name": "note",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "created_date": {
          "name": "created_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_date": {
          "name": "updated_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "receiver_name": {
          "name": "receiver_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "shipping_cost": {
          "name": "shipping_cost",
          "type": "double(8,2)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "repeated_journal_log": {
      "name": "repeated_journal_log",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "journal_id": {
          "name": "journal_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "report_columns": {
      "name": "report_columns",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "column_name": {
          "name": "column_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "report_key": {
          "name": "report_key",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "name_en": {
          "name": "name_en",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "name_ar": {
          "name": "name_ar",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "request": {
      "name": "request",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "person_name": {
          "name": "person_name",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "user_id": {
          "name": "user_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "enum('1','2','3')",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "enum('1','2','3')",
          "nullable": false,
          "autoIncrement": false
        },
        "description": {
          "name": "description",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "revenue_bills": {
      "name": "revenue_bills",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "debit_account_id": {
          "name": "debit_account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "credit_account_id": {
          "name": "credit_account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "memo": {
          "name": "memo",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "approved": {
          "name": "approved",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "trans_date": {
          "name": "trans_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "reference": {
          "name": "reference",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "uuid": {
          "name": "uuid",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_hash": {
          "name": "invoice_hash",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "signing_time": {
          "name": "signing_time",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "xml": {
          "name": "xml",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "sent_to_zatca": {
          "name": "sent_to_zatca",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "QrCode": {
          "name": "QrCode",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "zatca_error": {
          "name": "zatca_error",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "revenue_bills_2025": {
      "name": "revenue_bills_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "debit_account_id": {
          "name": "debit_account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "credit_account_id": {
          "name": "credit_account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "memo": {
          "name": "memo",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "approved": {
          "name": "approved",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "trans_date": {
          "name": "trans_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "reference": {
          "name": "reference",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "uuid": {
          "name": "uuid",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_hash": {
          "name": "invoice_hash",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "signing_time": {
          "name": "signing_time",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "xml": {
          "name": "xml",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "sent_to_zatca": {
          "name": "sent_to_zatca",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "QrCode": {
          "name": "QrCode",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "zatca_error": {
          "name": "zatca_error",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "revenue_bill_records": {
      "name": "revenue_bill_records",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "product_number": {
          "name": "product_number",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "account_id": {
          "name": "account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "description": {
          "name": "description",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "reference": {
          "name": "reference",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "price": {
          "name": "price",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "total_price": {
          "name": "total_price",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "net_amount": {
          "name": "net_amount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost_center_tag_id": {
          "name": "cost_center_tag_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount": {
          "name": "discount",
          "type": "decimal(8,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_rate": {
          "name": "tax_rate",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "revenue_bill_records_2025": {
      "name": "revenue_bill_records_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "product_number": {
          "name": "product_number",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "account_id": {
          "name": "account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "description": {
          "name": "description",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "reference": {
          "name": "reference",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "price": {
          "name": "price",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "total_price": {
          "name": "total_price",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "net_amount": {
          "name": "net_amount",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost_center_tag_id": {
          "name": "cost_center_tag_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "discount": {
          "name": "discount",
          "type": "decimal(8,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_rate": {
          "name": "tax_rate",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "revenue_bill_returns": {
      "name": "revenue_bill_returns",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "debit_account_id": {
          "name": "debit_account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "credit_account_id": {
          "name": "credit_account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "memo": {
          "name": "memo",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "approved": {
          "name": "approved",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "valid_bill": {
          "name": "valid_bill",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "trans_date": {
          "name": "trans_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "reference": {
          "name": "reference",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "uuid": {
          "name": "uuid",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_hash": {
          "name": "invoice_hash",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "signing_time": {
          "name": "signing_time",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "sent_to_zatca": {
          "name": "sent_to_zatca",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "QrCode": {
          "name": "QrCode",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "zatca_error": {
          "name": "zatca_error",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "revenue_bill_return_records": {
      "name": "revenue_bill_return_records",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_number": {
          "name": "product_number",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "account_id": {
          "name": "account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "description": {
          "name": "description",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "reference": {
          "name": "reference",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "price": {
          "name": "price",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "total_price": {
          "name": "total_price",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_rate": {
          "name": "tax_rate",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "net_amount": {
          "name": "net_amount",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "discount": {
          "name": "discount",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "cost_center_tag_id": {
          "name": "cost_center_tag_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "roles_permissions": {
      "name": "roles_permissions",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "role_id": {
          "name": "role_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "permission_id": {
          "name": "permission_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "salesexcel": {
      "name": "salesexcel",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_date": {
          "name": "invoice_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "customer_code": {
          "name": "customer_code",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "route_code": {
          "name": "route_code",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_code": {
          "name": "product_code",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "uom": {
          "name": "uom",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "quantity_ct": {
          "name": "quantity_ct",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "quantity_un": {
          "name": "quantity_un",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "basic_total": {
          "name": "basic_total",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "discount_amount": {
          "name": "discount_amount",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax": {
          "name": "tax",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "total_amount": {
          "name": "total_amount",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "salesreturnexcel": {
      "name": "salesreturnexcel",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "transaction_no": {
          "name": "transaction_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "transaction_date": {
          "name": "transaction_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "customer_code": {
          "name": "customer_code",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "route_code": {
          "name": "route_code",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_code": {
          "name": "product_code",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "return_status": {
          "name": "return_status",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_reference_no": {
          "name": "invoice_reference_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "quantityct": {
          "name": "quantityct",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "quantityun": {
          "name": "quantityun",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "net_amt": {
          "name": "net_amt",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "disc_amt": {
          "name": "disc_amt",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_amt": {
          "name": "tax_amt",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "sales_dashboard_daily_summaries": {
      "name": "sales_dashboard_daily_summaries",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "bill_id": {
          "name": "bill_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "return_id": {
          "name": "return_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_category_id": {
          "name": "customer_category_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_category_id": {
          "name": "product_category_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "channel_id": {
          "name": "channel_id",
          "type": "tinyint(3)",
          "nullable": false,
          "autoIncrement": false
        },
        "document_type": {
          "name": "document_type",
          "type": "varchar(16)",
          "nullable": false,
          "autoIncrement": false
        },
        "gross_sales": {
          "name": "gross_sales",
          "type": "decimal(24,8)",
          "nullable": false,
          "autoIncrement": false
        },
        "discounts": {
          "name": "discounts",
          "type": "decimal(24,8)",
          "nullable": false,
          "autoIncrement": false
        },
        "returns": {
          "name": "returns",
          "type": "decimal(24,8)",
          "nullable": false,
          "autoIncrement": false
        },
        "net_sales": {
          "name": "net_sales",
          "type": "decimal(24,8)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(24,8)",
          "nullable": false,
          "autoIncrement": false
        },
        "min_unit_price": {
          "name": "min_unit_price",
          "type": "decimal(24,8)",
          "nullable": true,
          "autoIncrement": false
        },
        "max_unit_price": {
          "name": "max_unit_price",
          "type": "decimal(24,8)",
          "nullable": true,
          "autoIncrement": false
        },
        "gross_profit": {
          "name": "gross_profit",
          "type": "decimal(24,8)",
          "nullable": false,
          "autoIncrement": false
        },
        "commission": {
          "name": "commission",
          "type": "decimal(24,8)",
          "nullable": false,
          "autoIncrement": false
        },
        "delivery_cost": {
          "name": "delivery_cost",
          "type": "decimal(24,8)",
          "nullable": false,
          "autoIncrement": false
        },
        "outstanding": {
          "name": "outstanding",
          "type": "decimal(24,8)",
          "nullable": false,
          "autoIncrement": false
        },
        "overdue": {
          "name": "overdue",
          "type": "decimal(24,8)",
          "nullable": false,
          "autoIncrement": false
        },
        "invoice_count": {
          "name": "invoice_count",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "screen_field_options": {
      "name": "screen_field_options",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "screen_slug": {
          "name": "screen_slug",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "field_key": {
          "name": "field_key",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "is_required": {
          "name": "is_required",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "security_permissions": {
      "name": "security_permissions",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "slug": {
          "name": "slug",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "name_en": {
          "name": "name_en",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "parent_id": {
          "name": "parent_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "security_roles": {
      "name": "security_roles",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "slug": {
          "name": "slug",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "description": {
          "name": "description",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "name_en": {
          "name": "name_en",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "description_en": {
          "name": "description_en",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "sections": {
          "name": "sections",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "areas": {
          "name": "areas",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "inactive": {
          "name": "inactive",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "sides": {
      "name": "sides",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "gl_account_id": {
          "name": "gl_account_id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "sizes": {
      "name": "sizes",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "serial": {
          "name": "serial",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "convert": {
          "name": "convert",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "unit": {
          "name": "unit",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "pack": {
          "name": "pack",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "price": {
          "name": "price",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "purchase_price": {
          "name": "purchase_price",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "weight": {
          "name": "weight",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "main_size": {
          "name": "main_size",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "min_price": {
          "name": "min_price",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "sub_size": {
          "name": "sub_size",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "max_purchase": {
          "name": "max_purchase",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "soft_deletes": {
      "name": "soft_deletes",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "action": {
          "name": "action",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "ref": {
          "name": "ref",
          "type": "varchar(100)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "storekeeper_delegates": {
      "name": "storekeeper_delegates",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_keeper_id": {
          "name": "store_keeper_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "storekeeper_receipts": {
      "name": "storekeeper_receipts",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_name": {
          "name": "customer_name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "storekeeper_name": {
          "name": "storekeeper_name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "total_quantity": {
          "name": "total_quantity",
          "type": "decimal(15,8)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "storekeeper_receipt_items": {
      "name": "storekeeper_receipt_items",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "storekeeper_receipt_id": {
          "name": "storekeeper_receipt_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_name": {
          "name": "product_name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "size_name": {
          "name": "size_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(15,8)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "stores": {
      "name": "stores",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "name_en": {
          "name": "name_en",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_classification_id": {
          "name": "store_classification_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_account_id": {
          "name": "gl_account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "latitude": {
          "name": "latitude",
          "type": "varchar(100)",
          "nullable": true,
          "autoIncrement": false
        },
        "longitude": {
          "name": "longitude",
          "type": "varchar(100)",
          "nullable": true,
          "autoIncrement": false
        },
        "map_address": {
          "name": "map_address",
          "type": "varchar(150)",
          "nullable": true,
          "autoIncrement": false
        },
        "is_main": {
          "name": "is_main",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "dept_account_id": {
          "name": "dept_account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "approvemanager": {
          "name": "approvemanager",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "warehouse_code": {
          "name": "warehouse_code",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "disappear": {
          "name": "disappear",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "is_active": {
          "name": "is_active",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "production_store": {
          "name": "production_store",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "barn": {
          "name": "barn",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "categories_ids": {
          "name": "categories_ids",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "store_classifications": {
      "name": "store_classifications",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "name_en": {
          "name": "name_en",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "store_inventory": {
      "name": "store_inventory",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(100)",
          "nullable": true,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "m_cat_id": {
          "name": "m_cat_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "s_cat_id": {
          "name": "s_cat_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "store_inventory_2025": {
      "name": "store_inventory_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(100)",
          "nullable": true,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "m_cat_id": {
          "name": "m_cat_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "s_cat_id": {
          "name": "s_cat_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "store_inventory_details": {
      "name": "store_inventory_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "store_inventory_id": {
          "name": "store_inventory_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "inv_quantity": {
          "name": "inv_quantity",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(100)",
          "nullable": true,
          "autoIncrement": false
        },
        "c_quantity": {
          "name": "c_quantity",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "c_inv_quantity": {
          "name": "c_inv_quantity",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "production_date": {
          "name": "production_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "store_inventory_details_2025": {
      "name": "store_inventory_details_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "store_inventory_id": {
          "name": "store_inventory_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "inv_quantity": {
          "name": "inv_quantity",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(100)",
          "nullable": true,
          "autoIncrement": false
        },
        "c_quantity": {
          "name": "c_quantity",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "c_inv_quantity": {
          "name": "c_inv_quantity",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "production_date": {
          "name": "production_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "store_shelves": {
      "name": "store_shelves",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "shelvesName": {
          "name": "shelvesName",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "store_visits": {
      "name": "store_visits",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "start_time": {
          "name": "start_time",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "end_time": {
          "name": "end_time",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "subcategory_assets": {
      "name": "subcategory_assets",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name_en": {
          "name": "name_en",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "name_ar": {
          "name": "name_ar",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "categoryasset_id": {
          "name": "categoryasset_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "suppliercategories": {
      "name": "suppliercategories",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "suppliers_gl_account_type_id": {
          "name": "suppliers_gl_account_type_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "suppliers": {
      "name": "suppliers",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(50)",
          "nullable": false,
          "autoIncrement": false
        },
        "email": {
          "name": "email",
          "type": "varchar(50)",
          "nullable": true,
          "autoIncrement": false
        },
        "address": {
          "name": "address",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "phone": {
          "name": "phone",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "commercial_register": {
          "name": "commercial_register",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "fax": {
          "name": "fax",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_number": {
          "name": "tax_number",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "remain": {
          "name": "remain",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "bank": {
          "name": "bank",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "gl_account_id": {
          "name": "gl_account_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "oppening_balance": {
          "name": "oppening_balance",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "supplierCat_id": {
          "name": "supplierCat_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "SupplierCode": {
          "name": "SupplierCode",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "contract_shortcut_name": {
          "name": "contract_shortcut_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "contract_discipline": {
          "name": "contract_discipline",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "contract_sub_discipline": {
          "name": "contract_sub_discipline",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "contract_location": {
          "name": "contract_location",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "contract_remark": {
          "name": "contract_remark",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "system_type": {
          "name": "system_type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "city_id": {
          "name": "city_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "region_id": {
          "name": "region_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "name_en": {
          "name": "name_en",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "supplier_images": {
      "name": "supplier_images",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "supplier_id": {
          "name": "supplier_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "real_name": {
          "name": "real_name",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "supplier_price_list": {
      "name": "supplier_price_list",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "supplier_id": {
          "name": "supplier_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "supplier_category_id": {
          "name": "supplier_category_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "region_id": {
          "name": "region_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "active": {
          "name": "active",
          "type": "tinyint(4)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "supplier_price_list_details": {
      "name": "supplier_price_list_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "supplier_price_list_id": {
          "name": "supplier_price_list_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "size_id": {
          "name": "size_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "price": {
          "name": "price",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "systemtexts": {
      "name": "systemtexts",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "text_key": {
          "name": "text_key",
          "type": "varchar(55)",
          "nullable": false,
          "autoIncrement": false
        },
        "value": {
          "name": "value",
          "type": "varchar(200)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "system_config": {
      "name": "system_config",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "key": {
          "name": "key",
          "type": "varchar(55)",
          "nullable": false,
          "autoIncrement": false
        },
        "value": {
          "name": "value",
          "type": "varchar(155)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "system_log": {
      "name": "system_log",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "varchar(55)",
          "nullable": true,
          "autoIncrement": false
        },
        "action": {
          "name": "action",
          "type": "varchar(55)",
          "nullable": true,
          "autoIncrement": false
        },
        "ref_id": {
          "name": "ref_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "user_id": {
          "name": "user_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(13)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "sys_prefs": {
      "name": "sys_prefs",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "value": {
          "name": "value",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "tag_associations": {
      "name": "tag_associations",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "record_id": {
          "name": "record_id",
          "type": "varchar(15)",
          "nullable": false,
          "autoIncrement": false
        },
        "tag_id": {
          "name": "tag_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "targetquantities": {
      "name": "targetquantities",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "month": {
          "name": "month",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "quantity": {
          "name": "quantity",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "investidationrate": {
          "name": "investidationrate",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "commission": {
          "name": "commission",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "targets": {
      "name": "targets",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "month": {
          "name": "month",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "number_days": {
          "name": "number_days",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "target_value": {
          "name": "target_value",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "sales_percentage": {
          "name": "sales_percentage",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "sales_commission": {
          "name": "sales_commission",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "Collections": {
          "name": "Collections",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "Collection_percentage": {
          "name": "Collection_percentage",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "Collection_commission": {
          "name": "Collection_commission",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "target_value_with_quantities": {
      "name": "target_value_with_quantities",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "month": {
          "name": "month",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "target_value": {
          "name": "target_value",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "verification_rate": {
          "name": "verification_rate",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "every_quantity": {
          "name": "every_quantity",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "commission_rate": {
          "name": "commission_rate",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "tasks": {
      "name": "tasks",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "assigner_id": {
          "name": "assigner_id",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "assignee_id": {
          "name": "assignee_id",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "project_id": {
          "name": "project_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "start_date": {
          "name": "start_date",
          "type": "datetime",
          "nullable": true,
          "autoIncrement": false
        },
        "task_type_id": {
          "name": "task_type_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "expected_end_time": {
          "name": "expected_end_time",
          "type": "datetime",
          "nullable": true,
          "autoIncrement": false
        },
        "status": {
          "name": "status",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "priority": {
          "name": "priority",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "expected_cost": {
          "name": "expected_cost",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "actual_cost": {
          "name": "actual_cost",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "attachment": {
          "name": "attachment",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "description": {
          "name": "description",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "task_types": {
      "name": "task_types",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "name_en": {
          "name": "name_en",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "name_ar": {
          "name": "name_ar",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "taxassets": {
      "name": "taxassets",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_name": {
          "name": "tax_name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "percentage": {
          "name": "percentage",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "taxform_headers": {
      "name": "taxform_headers",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "name_en": {
          "name": "name_en",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "name_ar": {
          "name": "name_ar",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "taxvalues": {
      "name": "taxvalues",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "value": {
          "name": "value",
          "type": "decimal(8,2)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "tax_declaration": {
      "name": "tax_declaration",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "from_date": {
          "name": "from_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "to_date": {
          "name": "to_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_amount": {
          "name": "tax_amount",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "account_id": {
          "name": "account_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "attach": {
          "name": "attach",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "note": {
          "name": "note",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "journal_id": {
          "name": "journal_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "tax_forms": {
      "name": "tax_forms",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "header_id": {
          "name": "header_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "description": {
          "name": "description",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "account_id": {
          "name": "account_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "enum('debit','credit','both')",
          "nullable": true,
          "autoIncrement": false
        },
        "transaction_type": {
          "name": "transaction_type",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "trans_type": {
          "name": "trans_type",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "decimal(15,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "cat": {
          "name": "cat",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "not_include_tax": {
          "name": "not_include_tax",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "show_main_amount": {
          "name": "show_main_amount",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "tax_groups": {
      "name": "tax_groups",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(60)",
          "nullable": false,
          "autoIncrement": false
        },
        "inactive": {
          "name": "inactive",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "tax_group_items": {
      "name": "tax_group_items",
      "columns": {
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_group_id": {
          "name": "tax_group_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_type_id": {
          "name": "tax_type_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_shipping": {
          "name": "tax_shipping",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "tax_number_memos": {
      "name": "tax_number_memos",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_number": {
          "name": "tax_number",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "tax_memo": {
          "name": "tax_memo",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "tax_types": {
      "name": "tax_types",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "rate": {
          "name": "rate",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "sales_gl_account_id": {
          "name": "sales_gl_account_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "purchasing_gl_account_id": {
          "name": "purchasing_gl_account_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(60)",
          "nullable": false,
          "autoIncrement": false
        },
        "inactive": {
          "name": "inactive",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "telescope_entries": {
      "name": "telescope_entries",
      "columns": {
        "sequence": {
          "name": "sequence",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "uuid": {
          "name": "uuid",
          "type": "char(36)",
          "nullable": false,
          "autoIncrement": false
        },
        "batch_id": {
          "name": "batch_id",
          "type": "char(36)",
          "nullable": false,
          "autoIncrement": false
        },
        "family_hash": {
          "name": "family_hash",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "should_display_on_index": {
          "name": "should_display_on_index",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "varchar(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "content": {
          "name": "content",
          "type": "longtext",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "datetime",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "telescope_entries_tags": {
      "name": "telescope_entries_tags",
      "columns": {
        "entry_uuid": {
          "name": "entry_uuid",
          "type": "char(36)",
          "nullable": false,
          "autoIncrement": false
        },
        "tag": {
          "name": "tag",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "telescope_monitoring": {
      "name": "telescope_monitoring",
      "columns": {
        "tag": {
          "name": "tag",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "tracking_visits": {
      "name": "tracking_visits",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "day": {
          "name": "day",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        },
        "comment": {
          "name": "comment",
          "type": "text",
          "nullable": false,
          "autoIncrement": false
        },
        "num_of_weeks": {
          "name": "num_of_weeks",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "tracking_visits_customers": {
      "name": "tracking_visits_customers",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "tracking_id": {
          "name": "tracking_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "delegate_route_cycle_id": {
          "name": "delegate_route_cycle_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "delegate_route_id": {
          "name": "delegate_route_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "transaction_types": {
      "name": "transaction_types",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "slug": {
          "name": "slug",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "name_ar": {
          "name": "name_ar",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "name_en": {
          "name": "name_en",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "category_id": {
          "name": "category_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "is_inclusive": {
          "name": "is_inclusive",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "transaction_type_categories": {
      "name": "transaction_type_categories",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "slug": {
          "name": "slug",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "name_ar": {
          "name": "name_ar",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "name_en": {
          "name": "name_en",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "transferexcel": {
      "name": "transferexcel",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "h_header_d_details": {
          "name": "h_header_d_details",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "a_stock_adjustment_t_warehouse_transfer": {
          "name": "a_stock_adjustment_t_warehouse_transfer",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "transaction_number": {
          "name": "transaction_number",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "transaction_date": {
          "name": "transaction_date",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "from_warehouse": {
          "name": "from_warehouse",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "to_warehouse": {
          "name": "to_warehouse",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "quantity_case": {
          "name": "quantity_case",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "quantity_unit": {
          "name": "quantity_unit",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "conversion_factor": {
          "name": "conversion_factor",
          "type": "decimal(15,2)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "transfers": {
      "name": "transfers",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "from_store": {
          "name": "from_store",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "to_store": {
          "name": "to_store",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "state": {
          "name": "state",
          "type": "enum('pending','approved','cancelled')",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "admin_approve": {
          "name": "admin_approve",
          "type": "tinyint(4)",
          "nullable": false,
          "autoIncrement": false
        },
        "manager_approve": {
          "name": "manager_approve",
          "type": "tinyint(4)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "approve_to_store_manage": {
          "name": "approve_to_store_manage",
          "type": "tinyint(4)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "transfers_2025": {
      "name": "transfers_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "from_store": {
          "name": "from_store",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "to_store": {
          "name": "to_store",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "state": {
          "name": "state",
          "type": "enum('pending','approved','cancelled')",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_journal_transaction_id": {
          "name": "gl_journal_transaction_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "admin_approve": {
          "name": "admin_approve",
          "type": "tinyint(4)",
          "nullable": false,
          "autoIncrement": false
        },
        "manager_approve": {
          "name": "manager_approve",
          "type": "tinyint(4)",
          "nullable": false,
          "autoIncrement": false
        },
        "notes": {
          "name": "notes",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "approve_to_store_manage": {
          "name": "approve_to_store_manage",
          "type": "tinyint(4)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "transfer_costs": {
      "name": "transfer_costs",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "transfer_id": {
          "name": "transfer_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost_id": {
          "name": "cost_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost_value": {
          "name": "cost_value",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "cost": {
          "name": "cost",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "supplier_id": {
          "name": "supplier_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "without_tax": {
          "name": "without_tax",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "transfer_costs_2025": {
      "name": "transfer_costs_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "transfer_id": {
          "name": "transfer_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost_id": {
          "name": "cost_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "cost_value": {
          "name": "cost_value",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_value": {
          "name": "tax_value",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "cost": {
          "name": "cost",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "supplier_id": {
          "name": "supplier_id",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        },
        "without_tax": {
          "name": "without_tax",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "transfer_details": {
      "name": "transfer_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "transfer_id": {
          "name": "transfer_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "decimal(15,4)",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(1000)",
          "nullable": false,
          "autoIncrement": false
        },
        "production_date": {
          "name": "production_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "shelve_id": {
          "name": "shelve_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "expire_date": {
          "name": "expire_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "unit_price": {
          "name": "unit_price",
          "type": "decimal(15,4)",
          "nullable": true,
          "autoIncrement": false
        },
        "to_shelve_id": {
          "name": "to_shelve_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "transfer_details_2025": {
      "name": "transfer_details_2025",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "transfer_id": {
          "name": "transfer_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "product_id": {
          "name": "product_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "size": {
          "name": "size",
          "type": "varchar(1000)",
          "nullable": false,
          "autoIncrement": false
        },
        "production_date": {
          "name": "production_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "invoice_no": {
          "name": "invoice_no",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "shelve_id": {
          "name": "shelve_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "expire_date": {
          "name": "expire_date",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "unit_price": {
          "name": "unit_price",
          "type": "double",
          "nullable": true,
          "autoIncrement": false
        },
        "to_shelve_id": {
          "name": "to_shelve_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "trans_tax_details": {
      "name": "trans_tax_details",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "trans_type": {
          "name": "trans_type",
          "type": "smallint(6)",
          "nullable": true,
          "autoIncrement": false
        },
        "trans_no": {
          "name": "trans_no",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "tran_date": {
          "name": "tran_date",
          "type": "date",
          "nullable": false,
          "autoIncrement": false
        },
        "tax_type_id": {
          "name": "tax_type_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "rate": {
          "name": "rate",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "ex_rate": {
          "name": "ex_rate",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "included_in_price": {
          "name": "included_in_price",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "net_amount": {
          "name": "net_amount",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "amount": {
          "name": "amount",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "memo": {
          "name": "memo",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "reg_type": {
          "name": "reg_type",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "users": {
      "name": "users",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "remember_token": {
          "name": "remember_token",
          "type": "varchar(100)",
          "nullable": true,
          "autoIncrement": false
        },
        "group_id": {
          "name": "group_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "address": {
          "name": "address",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "id_number": {
          "name": "id_number",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "email": {
          "name": "email",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "phone": {
          "name": "phone",
          "type": "varchar(22)",
          "nullable": true,
          "autoIncrement": false
        },
        "phone2": {
          "name": "phone2",
          "type": "varchar(55)",
          "nullable": true,
          "autoIncrement": false
        },
        "limit": {
          "name": "limit",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "city_id": {
          "name": "city_id",
          "type": "varchar(50)",
          "nullable": true,
          "autoIncrement": false
        },
        "region_id": {
          "name": "region_id",
          "type": "varchar(50)",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "latitude": {
          "name": "latitude",
          "type": "varchar(55)",
          "nullable": true,
          "autoIncrement": false
        },
        "longitude": {
          "name": "longitude",
          "type": "varchar(55)",
          "nullable": true,
          "autoIncrement": false
        },
        "gps_status": {
          "name": "gps_status",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "level": {
          "name": "level",
          "type": "enum('Fulladmin','Delegate','Manager','CityManager','RegionManager','storekeeper','Supperstorekeeper','DelegateSuperVisor')",
          "nullable": true,
          "autoIncrement": false
        },
        "job": {
          "name": "job",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "nationality": {
          "name": "nationality",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "photo": {
          "name": "photo",
          "type": "varchar(100)",
          "nullable": true,
          "autoIncrement": false
        },
        "password": {
          "name": "password",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "bank": {
          "name": "bank",
          "type": "double",
          "nullable": false,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "token": {
          "name": "token",
          "type": "varchar(100)",
          "nullable": true,
          "autoIncrement": false
        },
        "gps_state": {
          "name": "gps_state",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "damaged_store_id": {
          "name": "damaged_store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "gl_account_id": {
          "name": "gl_account_id",
          "type": "int(10)",
          "nullable": true,
          "autoIncrement": false
        },
        "box_gl_account_id": {
          "name": "box_gl_account_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "opening_balance": {
          "name": "opening_balance",
          "type": "decimal(8,2)",
          "nullable": false,
          "autoIncrement": false
        },
        "diff_account_id": {
          "name": "diff_account_id",
          "type": "decimal(8,2)",
          "nullable": true,
          "autoIncrement": false
        },
        "category_id": {
          "name": "category_id",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "itinerary": {
          "name": "itinerary",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        },
        "active": {
          "name": "active",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "Route_Code": {
          "name": "Route_Code",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "allow_to_sale": {
          "name": "allow_to_sale",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "payment_method_id": {
          "name": "payment_method_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "edit_price": {
          "name": "edit_price",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "discount_inapp": {
          "name": "discount_inapp",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "Wholesale": {
          "name": "Wholesale",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "firebase_token": {
          "name": "firebase_token",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "printA4": {
          "name": "printA4",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "small_print": {
          "name": "small_print",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "cash_bill_only_in_app": {
          "name": "cash_bill_only_in_app",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "default_customer": {
          "name": "default_customer",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "cost_center_tag_id": {
          "name": "cost_center_tag_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "dont_allow_return": {
          "name": "dont_allow_return",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "dont_allow_return_damage": {
          "name": "dont_allow_return_damage",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "delegates_supervisor": {
          "name": "delegates_supervisor",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "bypass_return_restriction": {
          "name": "bypass_return_restriction",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "stores_transferred_from": {
          "name": "stores_transferred_from",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "bill_without_tax": {
          "name": "bill_without_tax",
          "type": "tinyint(1)",
          "nullable": false,
          "autoIncrement": false
        },
        "dont_allow_return_valid": {
          "name": "dont_allow_return_valid",
          "type": "tinyint(1)",
          "nullable": true,
          "autoIncrement": false
        },
        "pos_free_quantity": {
          "name": "pos_free_quantity",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "users_group": {
      "name": "users_group",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(80)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "users_group_assets": {
      "name": "users_group_assets",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(80)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "user_access_rolls": {
      "name": "user_access_rolls",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "roll_id": {
          "name": "roll_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "group_id": {
          "name": "group_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "Private_user": {
          "name": "Private_user",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "user_access_rolls_assets": {
      "name": "user_access_rolls_assets",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "roll_id": {
          "name": "roll_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "group_id": {
          "name": "group_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "Private_user": {
          "name": "Private_user",
          "type": "bigint(20)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "user_blocked_branches": {
      "name": "user_blocked_branches",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "user_id": {
          "name": "user_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "user_rolls": {
      "name": "user_rolls",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(80)",
          "nullable": false,
          "autoIncrement": false
        },
        "key": {
          "name": "key",
          "type": "varchar(50)",
          "nullable": false,
          "autoIncrement": false
        },
        "section": {
          "name": "section",
          "type": "varchar(50)",
          "nullable": true,
          "autoIncrement": false
        },
        "section_ar": {
          "name": "section_ar",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "user_rolls_assets": {
      "name": "user_rolls_assets",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "name": {
          "name": "name",
          "type": "varchar(80)",
          "nullable": false,
          "autoIncrement": false
        },
        "key": {
          "name": "key",
          "type": "varchar(50)",
          "nullable": false,
          "autoIncrement": false
        },
        "section": {
          "name": "section",
          "type": "varchar(50)",
          "nullable": true,
          "autoIncrement": false
        },
        "section_ar": {
          "name": "section_ar",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "user_store": {
      "name": "user_store",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "user_id": {
          "name": "user_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "store_id": {
          "name": "store_id",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "visits": {
      "name": "visits",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "branch_id": {
          "name": "branch_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "delegate_id": {
          "name": "delegate_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "customer_id": {
          "name": "customer_id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "date": {
          "name": "date",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "time": {
          "name": "time",
          "type": "varchar(100)",
          "nullable": false,
          "autoIncrement": false
        },
        "details": {
          "name": "details",
          "type": "text",
          "nullable": false,
          "autoIncrement": false
        },
        "code": {
          "name": "code",
          "type": "int(11)",
          "nullable": true,
          "autoIncrement": false
        },
        "end_time": {
          "name": "end_time",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        },
        "address": {
          "name": "address",
          "type": "varchar(191)",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "voided": {
      "name": "voided",
      "columns": {
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "id": {
          "name": "id",
          "type": "int(11)",
          "nullable": false,
          "autoIncrement": false
        },
        "date_": {
          "name": "date_",
          "type": "date",
          "nullable": true,
          "autoIncrement": false
        },
        "memo_": {
          "name": "memo_",
          "type": "text",
          "nullable": false,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "zatcaboardtests": {
      "name": "zatcaboardtests",
      "columns": {
        "id": {
          "name": "id",
          "type": "bigint(20)",
          "nullable": false,
          "autoIncrement": false
        },
        "type": {
          "name": "type",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "xml": {
          "name": "xml",
          "type": "longtext",
          "nullable": true,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    },
    "zatca_config": {
      "name": "zatca_config",
      "columns": {
        "id": {
          "name": "id",
          "type": "int(10)",
          "nullable": false,
          "autoIncrement": false
        },
        "created_at": {
          "name": "created_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "updated_at": {
          "name": "updated_at",
          "type": "timestamp",
          "nullable": true,
          "autoIncrement": false
        },
        "key": {
          "name": "key",
          "type": "varchar(191)",
          "nullable": false,
          "autoIncrement": false
        },
        "value": {
          "name": "value",
          "type": "text",
          "nullable": true,
          "autoIncrement": false
        }
      },
      "primaryKey": [],
      "foreignKeys": [],
      "indexes": []
    }
  },
  "views": {}
};
if (typeof module !== 'undefined') module.exports = CURRENT_DATABASE_SCHEMA;
