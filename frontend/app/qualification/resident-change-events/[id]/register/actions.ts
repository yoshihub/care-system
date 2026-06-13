"use server";

import { BackendApiError, backendFetch } from "@/lib/backend";

export type QualificationRegisterResult = {
  qualification_history: {
    id: number;
    change_type: string;
    qualification_date: string;
    qualification_start_date: string | null;
    qualification_end_date: string | null;
  };
  insured_person: {
    id: number;
    insured_no: string;
    name: string;
    status: string;
    qualification_start_date: string | null;
    qualification_end_date: string | null;
  };
  source_event: {
    id: number;
    process_status: string;
  };
};

type RegisterApiResponse = {
  data: QualificationRegisterResult["qualification_history"];
  meta: { message: string };
  insured_person: QualificationRegisterResult["insured_person"];
  source_event: QualificationRegisterResult["source_event"];
};

export type RegisterQualificationState =
  | { ok: true; result: QualificationRegisterResult }
  | {
      ok: false;
      message?: string;
      fieldErrors?: Record<string, string[]>;
    };

export const initialRegisterQualificationState: RegisterQualificationState = {
  ok: false,
};

function readOptionalString(formData: FormData, key: string): string | undefined {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
}

function parseApiError(error: unknown): RegisterQualificationState {
  if (error instanceof BackendApiError) {
    if (typeof error.body === "object" && error.body !== null) {
      const body = error.body as {
        message?: string;
        errors?: Record<string, string[]>;
      };
      return {
        ok: false,
        message: body.message ?? "資格登録に失敗しました。",
        fieldErrors: body.errors,
      };
    }
    return { ok: false, message: error.message };
  }

  return {
    ok: false,
    message: "資格登録に失敗しました。通信環境を確認してください。",
  };
}

/** 資格登録を Laravel API 経由で実行する Server Action */
export async function registerQualificationAction(
  _prevState: RegisterQualificationState,
  formData: FormData
): Promise<RegisterQualificationState> {
  const sourceEventId = formData.get("source_event_id");
  const changeType = formData.get("change_type");
  const qualificationDate = formData.get("qualification_date");

  if (typeof sourceEventId !== "string" || sourceEventId === "") {
    return { ok: false, message: "対象イベントが指定されていません。" };
  }
  if (typeof changeType !== "string" || changeType === "") {
    return { ok: false, message: "異動区分は必須です。" };
  }
  if (typeof qualificationDate !== "string" || qualificationDate === "") {
    return { ok: false, message: "資格日は必須です。" };
  }

  const payload: Record<string, string | number> = {
    source_event_id: Number(sourceEventId),
    change_type: changeType,
    qualification_date: qualificationDate,
  };

  const qualificationReasonCode = readOptionalString(
    formData,
    "qualification_reason_code"
  );
  const notificationDate = readOptionalString(formData, "notification_date");
  const qualificationStartDate = readOptionalString(
    formData,
    "qualification_start_date"
  );
  const qualificationEndDate = readOptionalString(
    formData,
    "qualification_end_date"
  );

  if (qualificationReasonCode !== undefined) {
    payload.qualification_reason_code = qualificationReasonCode;
  }
  if (notificationDate !== undefined) {
    payload.notification_date = notificationDate;
  }
  if (qualificationStartDate !== undefined) {
    payload.qualification_start_date = qualificationStartDate;
  }
  if (qualificationEndDate !== undefined) {
    payload.qualification_end_date = qualificationEndDate;
  }

  try {
    const body = await backendFetch<RegisterApiResponse>(
      "/api/qualification-histories",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    return {
      ok: true,
      result: {
        qualification_history: body.data,
        insured_person: body.insured_person,
        source_event: body.source_event,
      },
    };
  } catch (error) {
    return parseApiError(error);
  }
}
