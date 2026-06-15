<?php

namespace Database\Seeders;

use App\Models\CertificateIssueHistory;
use App\Models\InsuredPerson;
use App\Models\QualificationHistory;
use App\Models\ReissueApplication;
use App\Models\ResidentChangeEvent;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

/**
 * 介護 PoC デモ用初期データ Seeder (DemoSeeder)。
 *
 * このファイルは何か:
 *   動作確認・デモ用のサンプルデータを DB に投入する Seeder。
 *   2つの代表シナリオを再現可能な状態で用意する。
 *
 * どう使われるか:
 *   - DatabaseSeeder から call される。
 *   - シナリオA: 未処理の住民異動イベント → 資格登録フローの出発点。
 *   - シナリオB: 資格有効・証発行済み被保険者 + 再交付申請 → 再交付フローの出発点。
 *
 * 設計メモ:
 *   - シナリオA では被保険者を作らない (資格登録 API が作成する)。
 *   - Factory の state (age65, active, received 等) を組み合わせて一貫したデータを生成する。
 */
class DemoSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->seedScenarioAPendingEvents();
        $this->seedScenarioBExistingInsuredPersons();
    }

    /**
     * シナリオA: これから資格登録する「未処理の住民異動イベント」。
     * この時点では被保険者はまだ作らない (資格登録タスクで作る)。
     */
    private function seedScenarioAPendingEvents(): void
    {
        // デモの主役: 65歳到達・未処理。
        ResidentChangeEvent::factory()->age65()->create([
            'event_uid' => 'DEMO-AGE65-001',
            'name' => '介護 太郎',
            'kana' => 'カイゴ タロウ',
            'gender_code' => '1',
        ]);

        // 一覧に複数並ぶように、もう数件の未処理イベントを足す。
        ResidentChangeEvent::factory()->age65()->count(2)->create();
        ResidentChangeEvent::factory()->moveIn()->create();
    }

    /**
     * シナリオB: すでに資格があり証も発行済みの被保険者と、その再交付申請。
     */
    private function seedScenarioBExistingInsuredPersons(): void
    {
        // デモの主役: 資格有効・被保険者証発行済み。
        $hero = InsuredPerson::factory()->active()->create([
            'resident_no' => 'DEMO-R-0001',
            'insured_no' => '1300000001',
            'name' => '保険 花子',
            'kana' => 'ホケン ハナコ',
            'gender_code' => '2',
            'current_certificate_status_code' => 'ISSUED',
        ]);
        $this->attachQualificationAndCertificate($hero);

        // 一覧に複数並ぶように、もう数人の被保険者を同じ構成で足す。
        InsuredPerson::factory()->active()->count(3)->create()
            ->each(fn (InsuredPerson $person) => $this->attachQualificationAndCertificate($person));

        // 再交付申請 (受付済・未処理) を主役に紐づける。再発行のデモ起点になる。
        ReissueApplication::factory()->received()->create([
            'insured_person_id' => $hero->id,
            'certificate_type' => 'INSURED_CARD',
            'application_reason_code' => 'LOST',
            'applicant_name' => $hero->name,
            'applicant_relationship_code' => '01',
        ]);
    }

    /**
     * 被保険者に「資格取得履歴 (最新)」と「発行済みの被保険者証 (最新)」を1件ずつ付ける。
     */
    private function attachQualificationAndCertificate(InsuredPerson $person): void
    {
        QualificationHistory::factory()->acquire()->create([
            'insured_person_id' => $person->id,
            'qualification_date' => $person->qualification_start_date,
            'qualification_start_date' => $person->qualification_start_date,
            'is_latest' => true,
        ]);

        CertificateIssueHistory::factory()->issued()->create([
            'insured_person_id' => $person->id,
            'is_latest' => true,
        ]);
    }
}
