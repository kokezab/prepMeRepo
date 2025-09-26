import { message } from "antd";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks.ts";
import { dequeueMessage } from "@/redux/uiSlice";

export default function GlobalMessageHost() {
  const [messageApi, contextHolder] = message.useMessage();
  const queue = useAppSelector((s) => s.ui.messageQueue);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!queue.length) return;
    const current = queue[0];
    // Use the generic open API so we can pass type and attach onClose
    messageApi.open({
      type: current.type,
      content: current.content,
      key: current.key,
      onClose: () => dispatch(dequeueMessage()),
    });
  }, [queue, messageApi, dispatch]);

  return contextHolder;
}
