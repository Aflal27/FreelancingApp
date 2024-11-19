import { Button, Card, Table } from "flowbite-react";
import React from "react";
import { GoPlus } from "react-icons/go";


export default function Requirment() {
  return (
    <div>
      <Card>
        <Table>
          <Table.Head>
            <Table.HeadCell>Question</Table.HeadCell>
            <Table.HeadCell>Choice</Table.HeadCell>
          </Table.Head>
        </Table>
        <div
          onClick={() => setOpenModalReq(!openModalReq)}
          className=" text-blue-500 flex items-center gap-1 cursor-pointer hover:opacity-40">
          <GoPlus size={22} />
          <p>Add New question</p>
        </div>
        <Button
          onClick={() => handleTab("gal")}
          color="success"
          className=" w-28">
          Save
        </Button>
      </Card>
    </div>
  );
}
