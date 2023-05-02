import "./userList.scss";
import { Button, Tag } from "antd";
import { useState, useEffect } from "react";
import MasterPanelService from "../../service/MasterPanelService";
import Texty from 'rc-texty';

import { Table, Tooltip, Popconfirm } from 'antd';
import Textarea from '@mui/joy/Textarea';

import { Form, Input, InputNumber, Typography } from 'antd';
import { DollarCircleOutlined } from "@ant-design/icons";


const UserList = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadings, setLoadings] = useState([]);
  const [rowList, setRowList] = useState({});
  const [form] = Form.useForm();

  const amountValue = Form.useWatch('amount', form);
  const accountDescriptionValue = Form.useWatch('accountDescriptionValue', form);



  async function handleTake(id, rowId) {
    try {
      setRowList(() => {
        rowList[id] = true;
        return rowList;
      });
      const request = {
        amount: 999
      };
      await MasterPanelService.takeTransaction(id, request);
      const response = await MasterPanelService.getTransactions();
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[rowId] = true;
        return newLoadings;
      });
      setTimeout(() => {
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings];
          newLoadings[rowId] = false;
          console.log(rowId);
          return newLoadings;
        });
        setRowList(() => {
          delete rowList[id];
          return rowList;
        });
        setData(response.data);
      }, 1000);

    } catch (error) {
      console.log(error);
    }
    console.log(data);
  }

  async function handleApprove(id) {
    try {
      const request = {
        amount: amountValue,
        accountDescription: accountDescriptionValue
      };
      await MasterPanelService.doneTransaction(id, request);
      const response = await MasterPanelService.getTransactions();
      setData(response.data);
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  }

  async function handleReject(id) {
    try {
      const request = {
        amount: amountValue,
        accountDescription: accountDescriptionValue
      };
      await MasterPanelService.rejectTransaction(id, request);
      const response = await MasterPanelService.getTransactions();
      setData(response.data);
      form.resetFields();
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await MasterPanelService.getTransactions();
        setData(response.data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const userColumns = [
    { key: "id", title: "ID", dataIndex: 'id', },
    {
      key: "groupName",
      title: "Grup İsmi",
      render: (row) => {
        return (
          row.skypeMessageDto.skypeGroup.name
        );
      },
    },

    {
      key: "groupType",
      title: "Grup Türü",
      render: (row) => {
        return (
          row.skypeMessageDto.skypeGroup.type == "WITHDRAW" ? "Çekim" : "Yatırım"
        );
      },
    },

    {
      key: "user",
      title: "İşlem Yapan Kullanıcı",
      width: 170,
      render: (row) => {
        return (
          !(row.id in rowList) ?
            row.user == null ? (
              <Button type="primary" onClick={() => handleTake(row.id, data.indexOf(row))}>
                Üstlen
              </Button>
            ) : (
              <Texty>{row.user.username}</Texty>
            ) : <Button type="success" loading={loadings[data.indexOf(row)]}>İşlem Yapılıyor</Button>
        );
      },
    },
    {
      field: "skypeMessageDto.content",
      title: "Mesaj",
      render: (row) => {
        return (
          row.skypeMessageDto.content

          //   <Tooltip title={row.skypeMessageDto.content}>
          //   <span>Skype Mesajı</span>
          // </Tooltip>

        );
      },
    },

    {
      field: "status",
      title: "Statü",
      render: (row) => {
        return (
          row.status == 'NEW' ? <Tag color="blue">Yeni İşlem</Tag>
            : row.status == 'TAKEN' ? <Tag color="orange">İşleme alındı</Tag>
              : row.status == 'DONE' ? <Tag color="green">Tamamlandı</Tag>
                : row.status == 'REJECT' ? <Tag color="red">Red</Tag>
                  : <Tag color="purple">Mesaj güncellendi</Tag>

        );
      },
    },
    {
      field: "createTime",
      title: "İşlem Tarihi",
      render: (row) => {
        return (
          new Date(row.createTime).toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })
        );
      },
    },
    {
      key: "action",
      title: "Aksiyon",
      render: (row) => {
        return (
          row.status == "DONE" || row.status == "REJECT" || row.user == null ?
            "" :
            <div className="cellAction" >
              {row.skypeMessageDto.skypeGroup.type == "DEPOSIT" ?

                <Popconfirm
                  placement="left"
                  icon={<DollarCircleOutlined />}
                  title={<Form form={form} layout="vertical" autoComplete="off">
                    <Form.Item name="amount" label="Tutar">
                      <InputNumber min={0} type="number" />
                    </Form.Item>
                  </Form>}
                  onConfirm={() => handleApprove(row.id)}
                  okText="Onayla"
                  cancelText="Vazgeç">
                  <Button type="primary">Onay</Button></Popconfirm> :
                <Popconfirm
                  placement="left"
                  icon={<DollarCircleOutlined />}
                  title={<Form form={form} layout="vertical" autoComplete="off">
                    <Form.Item name="amount" label="Tutar">
                      <InputNumber min={0} type="number" />
                    </Form.Item>
                    <Form.Item name="accountDescription" label="Banka Bilgileri">
                      <Input />
                    </Form.Item>
                  </Form>}
                  onConfirm={() => handleApprove(row.id)}
                  okText="Onayla"
                  cancelText="Vazgeç">
                  <Button type="primary">Onay</Button></Popconfirm>}

              <Popconfirm
                placement="top"
                title="İşlem reddedilecek. Devam etmek istiyor musunuz?"
                onConfirm={() => handleReject(row.id)}
                okText="Reddet"
                cancelText="Vazgeç">
                <Button type="primary" danger>Red</Button></Popconfirm>
            </div>

        );
      },
    },
  ];



  return (
    <div className="datatable">
      <div className="datatableTitle">
        İşlemler
      </div>
      {!loading &&
        <Table columns={userColumns}
          bordered
          // expandable={{
          //   expandedRowRender: (record) => (
          //     <p style={{ margin: 0 }}>{record.skypeMessageDto.content}</p>
          //   ),
          // }} 
          dataSource={data}
          scroll={{
          }}
        />
      }

    </div>
  );
};

export default UserList;