import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Gecrawlte Daten
const impressumContent = `Dieses Impressum gilt auch für die Facebookseite http://www.facebook.com/dzphotoat

**Zangerle Daniel**

**Dürerstr. 33**

**4050 Traun**

**ATU75329324**

Einzelunternehmen

Daniel Zangerle / dz-photo

Berufsfotografen Meister

**Tel: 0664 3900990**

**E-Mail: office@dz-photo.at**

Mitglied der WKÖ, WKOÖ, Landesinnung OÖ der Berufsfotografen, Bundesinnung Berufsfotografen

Berufsrecht – Gewerbeordnung: www.ris.bka.gv.at

Bezirkshauptmannschaft Linz-Land

Alle Rechte an den veröffentlichten Fotos, Bildern, Texten sowie dem Layout der Homepage liegen bei Zangerle Daniel (dz-photo) (im Folgenden "Autor" genannt). Die Weiterverwendung – auch für private Zwecke – ist nur mit ausdrücklicher, schriftlicher Genehmigung des Autors erlaubt. Bei Interesse wenden Sie sich bitte an den Autor.

Mit dem Betreten dieses Internetauftrittes bestätigen die Besucher die Einhaltung der hier und insbesondere im Bereich GALERIE genannten Nutzungsbedingungen. Bei Verstößen (beleidigende, schädigende, den guten Sitten widersprechende bzw. straf- oder/und zivilrechtlich relevante Handlungen, z.B. auch die unrechtmäßige Nutzung, Vervielfältigung, Weitergabe oder Veröffentlichung des urheberrechtlich geschützten Bildmaterials) behält sich der Autor vor, rechtliche Schritte einzuleiten.

**Rechtliche Hinweise**

(Haftungsausschluss/Disclaimer)

**1. Inhalt des Onlineangebotes**

Der Autor übernimmt keinerlei Gewähr für die Aktualität, Korrektheit, Vollständigkeit oder Qualität der bereitgestellten Informationen. Haftungsansprüche gegen den Autor, welche sich auf Schäden materieller oder ideeller Art beziehen, die durch die Nutzung oder Nichtnutzung der dargebotenen Informationen bzw. durch die Nutzung fehlerhafter und unvollständiger Informationen verursacht wurden, sind grundsätzlich ausgeschlossen, sofern seitens des Autors kein nachweislich vorsätzliches oder grob fahrlässiges Verschulden vorliegt. Alle Angebote sind freibleibend und unverbindlich. Der Autor behält es sich ausdrücklich vor, Teile der Seiten oder das gesamte Angebot ohne gesonderte Ankündigung zu verändern, zu ergänzen, zu löschen oder die Veröffentlichung zeitweise oder endgültig einzustellen.

**2. Verweise und Links**

Bei direkten oder indirekten Verweisen auf fremde Internetseiten ("Links"), die außerhalb des Verantwortungsbereiches des Autors liegen, würde eine Haftungsverpflichtung ausschließlich in dem Fall in Kraft treten, in dem der Autor von den Inhalten Kenntnis hat und es ihm technisch möglich und zumutbar wäre, die Nutzung im Falle rechtswidriger Inhalte zu verhindern. Der Autor erklärt daher ausdrücklich, dass zum Zeitpunkt der Linksetzung die entsprechenden verlinkten Seiten frei von illegalen Inhalten waren. Der Autor hat keinerlei Einfluss auf die aktuelle und zukünftige Gestaltung und auf die Inhalte der gelinkten/verknüpften Seiten. Deshalb distanziert er sich hiermit ausdrücklich von allen Inhalten aller gelinkten /verknüpften Seiten, insbesondere, da sie nach der Linksetzung verändert werden konnten und können. Diese Feststellung gilt für alle innerhalb des eigenen Internetangebotes gesetzten Links und Verweise sowie für Fremdeinträge in vom Autor eingerichteten Gästebüchern, Diskussionsforen und Mailinglisten. Für illegale, fehlerhafte oder unvollständige Inhalte und insbesondere für Schäden, die aus der Nutzung oder Nichtnutzung solcherart dargebotener Informationen entstehen, haftet allein der Anbieter der Seite, auf welche verwiesen wurde, nicht derjenige, der über Links auf die jeweilige Veröffentlichung lediglich verweist. Der Autor ist für Äußerungen der Besucher auf seinen Internetseiten nicht haftbar, da sie nicht zwangsläufig seine Meinung widergeben. Besucher als Verfasser haften für sämtliche von ihnen veröffentlichte Beiträge selbst und können dafür auch gerichtlich zur Verantwortung gezogen werden. Die Besucher werden daher angehalten, zu beachten, dass auch die freie Meinungsäußerung im Internet den Schranken des geltenden Rechts, insbesondere auch des Strafgesetzbuches (üble Nachrede, Ehrenbeleidigung etc.) oder des Verbotsgesetzes unterliegt. Der Autor behält sich vor, beleidigende, schädigende, den guten Sitten widersprechende bzw. straf- oder/und zivilrechtlich relevante Beiträge zu löschen und rechtsrelevante Tatbestände den zuständigen Behörden zur Kenntnis zu bringen bzw. anzuzeigen.

**3. Urheber- und Kennzeichenrecht**

Der Autor ist bestrebt, in allen Publikationen die Urheberrechte der verwendeten Grafiken, Tondokumente, Videosequenzen und Texte zu beachten, von ihm selbst erstellte Grafiken, Tondokumente, Videosequenzen und Texte zu nutzen oder auf lizenzfreie Grafiken, Tondokumente, Videosequenzen und Texte zurückzugreifen. Alle innerhalb des Internetangebotes genannten und ggf. durch Dritte geschützten Marken- und Warenzeichen unterliegen uneingeschränkt den Bestimmungen des jeweils gültigen Kennzeichenrechts und den Besitzrechten der jeweiligen eingetragenen Eigentümer. Allein aufgrund der bloßen Nennung ist nicht der Schluss zu ziehen, dass Markenzeichen nicht durch Rechte Dritter geschützt sind! Das Copyright für veröffentlichte, vom Autor selbst erstellte Objekte bleibt allein beim Autor der Seiten. Eine Vervielfältigung oder Verwendung solcher Grafiken, Tondokumente, Videosequenzen und Texte in anderen elektronischen oder gedruckten Publikationen ist ohne ausdrückliche Zustimmung des Autors nicht gestattet.

**4. Stornobedingungen**

4.1. Für Stornierungen von Hochzeitsfotografie-Aufträgen durch den Auftraggeber gelten folgende Stornosätze ab der Auftragserteilung als vereinbart:

Bis zu 3 Monate vor dem Hochzeitstermin: 30% der Auftragssumme

Bis zu 3 Wochen vor dem Hochzeitstermin: 50 % der Auftragssumme

ab 1 Woche vor der Hochzeit: 100% der Auftragssumme

4.2. Für Stornierungen aller sonstigen Fotoaufträgen (keine Hochzeit) gelten folgende Stornosätze ab der Auftragserteilung als vereinbart:

Bis zu 2 Wochen vor dem Shootingtermin kann die Anzahlung als Gutschrift für einen Ersatztermin einbehalten werden oder auf Wunsch zurückgezahlt werden.

2 Wochen bis zu 24h vor dem Shootingtermin wird die Anzahlung als Gutschrift auf ein Ersatzshooting einbehalten.

Ab 24h vor dem Shooting wird die Anzahlung als Stornogebühr einbehalten und kann nur bei nachweislich wichtigen Verhinderungsgründen bei einem Folgeshooting angerechnet werden. Dazu bedarf es dem Einverständnis und schriftlicher Zustimmung der Fotografen.

Wird ein Shooting ohne Anzahlung ausgemacht und kürzer als 24h vor dem Termin storniert, wird eine Stornogebühr von 50€ verrechnet und muss innerhalb von 14 Tagen überwiesen werden auf das Geschäftskonto von dz-photo.

4.3. Sollte ein Fotograf durch Krankheit, höhere Gewalt oder sonstigen wichtigen Gründen nicht zum vereinbarten Termin erscheinen können, wird dieser Umstand dem Kunden oder der Kundin baldestmöglich vorab mitgeteilt und es können keine Schadensansprüche geltend gemacht werden.

dz-photo bemüht sich ab 9h, ab Paket Gold einen zweiten Ersatzfotografen bereitzustellen, sollte ein Fotograf ausfallen, kann aber keine Garantie übernehmen. Es kann keine Preisminderung geltend gemacht werden.

4.4. Eine Teilstornierung von vereinbarten Hochzeitspaketen, wie zum Beispiel ein Down Grade von Paket Platin auf Gold ist nur mit dem Einverständnis von dz-photo möglich. In diesem Fall wird die Stornierung mit einer Ausfallsentschädigung von 50% der Einbußen abgegolten. Eine Teilstornierung von Buchungen unter Paket Gold 9h ist nicht möglich.

**5. Rechtswirksamkeit dieses Haftungsausschlusses**

Dieser Haftungsausschluss ist als Teil des Internetangebotes zu betrachten, von dem aus auf diese Seite verwiesen wurde. Sofern Teile oder einzelne Formulierungen dieses Textes der geltenden Rechtslage nicht, nicht mehr oder nicht vollständig entsprechen sollten, bleiben die übrigen Teile des Dokumentes in ihrem Inhalt und ihrer Gültigkeit davon unberührt.

6. Erfüllungsort und Gerichtsstand

6.1. Erfüllungsort und Gerichtsstand für alle sich aus mündlicher oder schriftlicher Auftragserteilung sowie aus meinen Lieferungen ergebenden Rechte und Pflichten ist ausschließlich Traun.`;

const datenschutzContent = `**Erklärung zur Informationspflicht**

**(Datenschutzerklärung)**

Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir verarbeiten Ihre Daten daher ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TKG 2003). In diesen Datenschutzinformationen informieren wir Sie über die wichtigsten Aspekte der Datenverarbeitung im Rahmen unserer Website.

**Kontakt mit uns**

Wenn Sie per Formular auf der Website oder per E-Mail Kontakt mit uns aufnehmen, werden Ihre angegebenen Daten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen sechs Monate bei uns gespeichert wenn es zu keinem Auftrag kommt, im Falle einer Auftragserteilung werden die Daten so lange als nötig gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.

**Datenspeicherung**

Wir weisen darauf hin, dass zum Zweck des einfacheren Einkaufsvorganges und zur späteren Vertragsabwicklung vom Webshop-Betreiber im Rahmen von Cookies die IP-Daten des Anschlussinhabers gespeichert werden, ebenso wie Name, Anschrift und Kreditkartennummer […] des Käufers.

Darüber hinaus werden zum Zweck der Vertragsabwicklung folgende Daten auch bei uns gespeichert: Name, Geburtstag, Anschrift, Hochzeitsdatum, Religion, Geschlecht, usw. Die von Ihnen bereit gestellten Daten sind zur Vertragserfüllung bzw zur Durchführung vorvertraglicher Maßnahmen erforderlich. Ohne diese Daten können wir den Vertrag mit Ihnen nicht abschließen. Eine Datenübermittlung an Dritte erfolgt nicht, mit Ausnahme der Übermittlung der Kreditkartendaten an die abwickelnden Bankinstitute/Zahlungsdienstleister zum Zwecke der Abbuchung des Einkaufspreises, an das von uns beauftragte Transportunternehmen/Versandunternehmen zur Zustellung der Ware sowie an unseren Steuerberater zur Erfüllung unserer steuerrechtlichen Verpflichtungen.

Nach Abbruch des Einkaufsvorganges werden die bei uns gespeicherten Daten gelöscht. Im Falle eines Vertragsabschlusses werden sämtliche Daten aus dem Vertragsverhältnis bis zum Ablauf der steuerrechtlichen Aufbewahrungsfrist (7 Jahre) gespeichert.

Die Daten Name, Anschrift, gekaufte Waren und Kaufdatum werden darüber hinaus gehend bis zum Ablauf der Produkthaftung (10 Jahre) gespeichert.  Die Datenverarbeitung erfolgt auf Basis der gesetzlichen Bestimmungen des § 96 Abs 3 TKG sowie des Art 6 Abs 1 lit a (Einwilligung) und/oder lit b (notwendig zur Vertragserfüllung) der DSGVO.

**Cookies**

Unsere Website verwendet so genannte Cookies. Dabei handelt es sich um kleine Textdateien, die mit Hilfe des Browsers auf Ihrem Endgerät abgelegt werden. Sie richten keinen Schaden an.

Wir nutzen Cookies dazu, unser Angebot nutzerfreundlich zu gestalten. Einige Cookies bleiben auf Ihrem Endgerät gespeichert, bis Sie diese löschen. Sie ermöglichen es uns, Ihren Browser beim nächsten Besuch wiederzuerkennen.

Wenn Sie dies nicht wünschen, so können Sie Ihren Browser so einrichten, dass er Sie über das Setzen von Cookies informiert und Sie dies nur im Einzelfall erlauben.

Bei der Deaktivierung von Cookies kann die Funktionalität unserer Website eingeschränkt sein.

**Web-Analyse**

Unsere Website verwendet Funktionen des Webanalysedienstes Google Analytics, einen Webanalysedienst der Google LLC ("Google"), Amphitheatre Parkway, Mountain View, CA 94043, USA. Die dabei erfassten Daten werden auch außerhalb der EU verarbeitet. Dazu werden Cookies verwendet, die eine Analyse der Benutzung der Website durch ihre Benutzer ermöglicht. Die dadurch erzeugten Informationen werden auf den Server des Anbieters übertragen und dort gespeichert.

Sie können dies verhindern, indem Sie Ihren Browser so einrichten, dass keine Cookies gespeichert werden.

Im Falle der Aktivierung der IP-Anonymisierung über ihren Browser, wird Ihre IP-Adresse von Google jedoch innerhalb von Mitgliedstaaten der Europäischen Union oder in anderen Vertragsstaaten des Abkommens über den Europäischen Wirtschaftsraum zuvor gekürzt.  Dadurch ist nur mehr eine grobe Lokalisierung möglich.

Die Beziehung zum Webanalyseanbieter basiert auf den Standardvertragsklauseln der EU im Rahmen des Privacy Shield Abkommens. Weitere Informationen: Google Datenschutzerklärung & Nutzungsbedingungen.

Die Datenverarbeitung erfolgt auf Basis der gesetzlichen Bestimmungen des § 96 Abs 3 TKG sowie des Art 6 Abs 1 lit a (Einwilligung) und/oder lit f (berechtigtes Interesse) der DSGVO.

Unser Anliegen im Sinne der DSGVO (berechtigtes Interesse) ist die Verbesserung unseres Angebotes und unseres Webauftritts. Da uns die Privatsphäre unserer Nutzer wichtig ist, werden die Nutzerdaten pseudonymisiert.

**Newsletter**

Sie haben die Möglichkeit, über unsere Website unseren Newsletter zu abonnieren. Hierfür benötigen wir Ihre E-Mail-Adresse und ihre Erklärung, dass Sie mit dem Bezug des Newsletters einverstanden sind.

Sobald Sie sich für den Newsletter angemeldet haben, senden wir Ihnen ein Bestätigungs-E-Mail mit einem Link zur Bestätigung der Anmeldung.

Das Abo des Newsletters können Sie jederzeit stornieren. Senden Sie Ihre Stornierung bitte an folgende E-Mail-Adresse: [office@dz-photo.at](mailto:office@dz-photo.at) Wir löschen anschließend umgehend Ihre Daten im Zusammenhang mit dem Newsletter-Versand.

**Ihre Rechte**

Ihnen stehen grundsätzlich die Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerruf und Widerspruch zu. Wenn Sie glauben, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstößt oder Ihre datenschutzrechtlichen Ansprüche sonst in einer Weise verletzt worden sind, können Sie sich bei der Aufsichtsbehörde beschweren. In Österreich ist dies die Datenschutzbehörde.

**Weiteres**

Ich nutze zur Erbringung meiner Leistung gegenüber meinen Kunden den Dienst [https://app.hochzeit.management](https://app.hochzeit.management/) und habe auf dieser Website ein Kontaktformular eingefügt, welches direkt mit diesem Dienst verbunden ist. Daher werden personenbezogene Daten über das Formular übermittelt.

Der Dienst [https://app.hochzeit.management](https://app.hochzeit.management/) bietet die Möglichkeit Stammdaten der betreuten Kunden/Brautpaare anzulegen, eine Kalenderverwaltung, eine Aufgaben-/To-Do-Liste, ein Postfach zur Kommunikation sowie die Möglichkeit direkt über den Dienst Angebote und Abrechnungen für Leistungen zu erstellen. Angeboten wird dieser Dienst von der Hochzeit.Management GmbH, mit welcher der Websiteverantwortliche einen Nutzungsvertrag sowie einen – datenschutzrechtlich notwendigen – Auftragsverarbeitungsvertrag hat. Der Dienst wird von Hochzeit.Management GmbH ausschließlich auf Servern gehostet werden, welche sich im EU-Raum befinden. Konkret werden die Daten in Traun (Oberösterreich) gespeichert.

**Beantwortung von Anfragen zum Datenschutz**

Wir ersuchen Sie Ihre Anfrage schriftlich oder per E-Mail mit einer beigelegten Ausweiskopie an folgende Adresse zu senden:

Daniel Zangerle

Dürerstr.33

4050 Traun

[office@dz-photo.at](mailto:office@dz-photo.at)

Wir werden Ihre Anfrage dann entsprechend der gesetzlichen Vorschriften bearbeiten.

**Sie erreichen uns unter folgenden Kontaktdaten:**

Unternehmen: Daniel Zangerle dz-photo

Telefonnummer: +43 664 390 09 90

Strasse: Dürerstr. 33

PLZ, Ort: 4050, Traun

E-Mail-Adresse: office@dz-photo.at`;

const agbContent = `**ALLGEMEINE GESCHÄFTSBEDINGUNGEN**

Allgemeine Geschäftsbedingungen für Fotografen (Auftragsannahme) Herausgegeben von der Bundesinnung der Fotografen und dem RSV

Die Erfordernisse gemäß dem Datenschutzgesetz 2018 wurden eingearbeitet.

1. Anwendbarkeit der Allgemeinen Geschäftsbedingungen

Die österreichischen Berufsfotografen schließen nur zu diesen Allgemeinen Geschäftsbedingungen ab. Mit der Auftragserteilung anerkennt der Auftraggeber deren Anwendbarkeit. Abweichende Vereinbarungen können rechtswirksam nur schriftlich getroffen werden. Diese Allgemeinen Geschäftsbedingungen gehen allfälligen Geschäftsbedingungen des Auftragsgebers oder des Mittlers vor.

2. Urheberrechtliche Bestimmungen

2.1 Alle Urheber- und Leistungsschutzrechte des Lichtbildherstellers (§§ 1, 2 Abs. 2, 73ff UrhG) stehen dem Fotografen zu. Nutzungsbewilligungen (Veröffentlichungsrechte etc.) gelten nur bei ausdrücklicher Vereinbarung als erteilt. Der Vertragspartner erwirbt in diesem Fall eine einfache (nicht exklusive und nicht ausschließende), nicht übertragbare (abtretbare) Nutzungsbewilligung für den ausdrücklich vereinbarten Verwendungszweck und innerhalb der vereinbarten Grenzen (Auflageziffer, zeitliche und örtliche Beschränkung etc.); im Zweifel ist der in der Rechnung bzw. im Lieferschein angeführten Nutzungsumfang maßgebend. Jedenfalls erwirbt der Vertragspartner nur soviel Rechte wie es dem offengelegten Zweck des Vertrags (erteilten Auftrags) entspricht. Mangels anderer Vereinbarung gilt die Nutzungsbewilligung nur für eine einmalige Veröffentlichung (in einer Auflage), nur für das ausdrücklich bezeichnete Medium des Auftraggebers und nicht für Werbezwecke als erteilt.

2.2 Der Vertragspartner ist bei jeder Nutzung (Vervielfältigung, Verbreitung, Sendung etc.) verpflichtet, die Herstellerbezeichnung (Namensnennung) bzw. den Copyrightvermerk im Sinn des WURA (Welturheberrechtsabkommen) deutlich und gut lesbar (sichtbar), insbesondere nicht gestürzt und in Normallettern, unmittelbar beim Lichtbild und diesem eindeutig zuordenbar anzubringen wie folgt: Foto: (c) .. Name/Firma/Künstlername des Fotografen; Ort und, so ferne veröffentlicht, Jahreszahl der ersten Veröffentlichung. Dies gilt auch dann, wenn das Lichtbild nicht mit einer Herstellerbezeichnung versehen ist. Jedenfalls gilt diese Bestimmung als Anbringung der Herstellerbezeichnung im Sinn des § 74 Abs 3. UrhG. Ist das Lichtbild auf der Vorderseite (im Bild) signiert, ersetzt die Veröffentlichung dieser Signatur nicht, wenn die Änderungen nach dem, dem Fotografen bekannten Vertragszweck erforderlich sind.

2.3 Jede Veränderung des Lichtbildes bedarf der schriftlichen Zustimmung des Fotografen. Dies gilt nur dann nicht, wenn die Änderung nach dem, dem Fotografen bekannten Vertragszweck erforderlich sind.

2.4 Die Nutzungsbewilligung gilt erst im Fall vollständiger Bezahlung des vereinbarten Aufnahme- und Verwendungshonorars und nur dann als erteilt, wenn eine ordnungsgemäße Herstellerbezeichnung / Namensnennung (Punkt 2.2 oben) erfolgt.

2.5 Anstelle des § 75 UrhG gilt die allgemeine Vorschrift des § 42 UrhG.

2.6 Im Fall einer Veröffentlichung sind zwei kostenlose Belegexemplare zuzusenden. Bei kostspieligen Produkten (Kunstbücher, Videokassetten) reduziert sich die Zahl der Belegexemplare auf ein Stück.

3. Eigentum am Filmmaterial – Archivierung

3.1. Das Eigentumsrecht am belichteten Filmmaterial (Negative, Diapositive etc.) steht dem Fotografen zu. Dieser überläßt dem Vertragspartner gegen vereinbarte und angemessene Honorierung die für die vereinbarte Nutzung erforderlichen Aufsichtsbilder ins Eigentum; Diapositive (Negative nur im Fall schriftlicher Vereinbarung) werden dem Vertragspartner nur leihweise gegen Rückstellung nach Gebrauch auf Gefahr und Kosten des Vertragspartners zur Verfügung gestellt, soferne nicht schriftlich etwas anderes vereinbart ist. Ist dies der Fall, gilt die Nutzungsbewilligung gleichfalls nur im Umfang des Punktes 2.1. als erteilt.

3.2. Der Fotograf ist berechtigt, die Lichtbilder in jeder ihm geeignet erscheinenden Weise (auch auf der Vorderseite) mit seiner Herstellerbezeichnung zu versehen. Der Vertragspartner ist verpflichtet, für die Integrität der Herstellerbezeichnung zu sorgen, und zwar insbesondere bei erlaubter Weitergabe an Dritte (Drucker etc.). Erforderlichenfalls ist die Herstellerbezeichnung anzubringen bzw. zu erneuern. Dies gilt insbesondere auch für alle bei der Herstellung erstellten Vervielfältigungsmittel (Lithos, Platten etc).

3.3. Der Fotograf wird die Aufnahme ohne Rechtspflicht archivieren. Im Fall des Verlusts oder der Beschädigung stehen dem Vertragspartner keinerlei Ansprüche zu.

4. Ansprüche Dritter

Für die Einholung einer allenfalls erforderlichen Zustimmung abgebildeter Gegenstände (z.B. Werke der Bildenden Kunst, Muster und Modelle, Marken, Fotovorlagen etc.) oder Personen (z.B. Modelle) hat der Vertragspartner zu sorgen. Er hält den Fotografen diesbezüglich schad- und klaglos, insbesondere hinsichtlich der Ansprüche nach §§ 78 UhrG, 1041 ABGB. Der Fotograf garantiert die Zustimmung von Berechtigten (Urheber, abgebildete Personen etc.), insbesondere von Modellen, nur im Fall ausdrücklicher schriftlicher Zusage für die vertraglichen Verwendungszwecke (Punkt 2.1).

5 Verlust und Beschädigung

5.1 Im Fall des Verlusts oder der Beschädigung von über Auftrag hergestellten Aufnahmen (Diapositive, Negativmaterial) haftet der Fotograf – aus welchem Rechttitel immer – nur für Vorsatz und grobe Fahrlässigkeit. Die Haftung ist auf eigenes Verschulden und dasjenige seiner Bediensteten beschränkt; für Dritte (Labors etc.) haftet der Fotograf nur für Vorsatz und grobe Fahrlässigkeit bei der Auswahl. Jede Haftung ist auf die Materialkosten und die kostenlose Wiederholung der Aufnahmen (so ferne und soweit dies möglich ist) beschränkt. Weitere Ansprüche stehen dem Auftraggeber nicht zu; der Fotograf haftet insbesondere nicht für allfällige Reise- und Aufenthaltsspesen sowie für Drittkosten (Modelle, Assistenten, Visagisten und sonstiges Aufnahmepersonal) oder für entgangenen Gewinn und Folgeschäden.

5.2 Punkt 5.1 gilt entsprechend für den Fall des Verlusts oder der Beschädigung übergebener Vorlagen (Filme, Layouts, Display-Stücke, sonstige Vorlagen etc.) und übergebene Produkte und Requisiten. Wertvollere Gegenstände sind vom Vertragspartner zu versichern.

5.3 Eine staatliche Preisanpassung der genannten Beträge bleibt vorbehalten.

6 Leistung und Gewährleistung

6.1 Der Fotograf wird den erteilten Auftrag sorgfältig ausführen. Er kann den Auftrag auch – zur Gänze oder zum Teil – durch Dritte (Labors etc.) ausführen lassen. So ferne der Vertragspartner keine schriftlichen Anordnungen trifft, ist der Fotograf hinsichtlich der Art der Durchführung des Auftrags frei. Dies gilt insbesondere Für die Bildauffassung, die Auswahl der Fotomodelle, des Aufnahmeorts und der angewendeten optischen-technischen (fotografischen) Mittel. Abweichungen von früheren Lieferungen stellen als solche keinen Mangel dar.

6.2 Für Mängel, die auf unrichtige oder ungenaue Anweisungen des Vertragspartners zurückzuführen sind, wird nicht gehaftet (§ 1168a ABGB). Jedenfalls haftet der Fotograf nur für Vorsatz und grobe Fahrlässigkeit.

6.3 Der Vertragspartner trägt das Risiko für alle Umstände, die nicht in der Person des Fotografen liegen, wie Wetterlage bei Außenaufnahmen, rechtzeitige Bereitstellung von Produkten und Requisiten, Ausfall von Modellen, Reisebehinderungen etc.

6.4 Sendungen werden auf Kosten und Gefahr des Vertragspartner verschickt.

6.5 Alle Beanstandungen müssen längstens innerhalb von 8 Tagen nach Lieferung schriftlich und unter Vorlage alle Unterlagen erfolgen. Nach Ablauf dieser Frist gilt die Leistung als auftragsgemäß erbracht. Die Gewährleistungsfrist beträgt drei Monate.

6.6 Im Fall der Mangelhaftigkeit steht dem Vertragspartner nur ein Verbesserungsanspruch durch den Fotografen zu. Ist eine Verbesserung unmöglich oder wird sie vom Fotografen abgelehnt, steht dem Vertragspartner eine Preisminderungsanspruch zu. Für unerhebliche Mängel wird nicht gehaftet. Farbdifferenzen bei Nachbestellungen gelten nicht als erheblicher Mangel. Punkt 5.1 gilt entsprechend.

6.7 Fixgeschäfte liegen nur bei ausdrücklicher schriftlicher Vereinbarung vor. Im Fall allfälliger Lieferverzögerungen gilt 5.1 entsprechend.

6.8 Die Honorar- und Lizenzgebührenansprüche stehen unabhängig davon zu, ob das Material urheber- und / oder leistungsschutzrechtlich (noch) geschützt ist.

7. Werklohn

7.1 Mangels ausdrücklicher schriftlicher Vereinbarung steht dem Fotografen ein Werklohn (Honorar) nach seinen jeweils gültigen Preislisten, sonst ein angemessenes Honorar zu.

7.2 Das Honorar steht auch für Layout- oder Präsentationsaufnahmen sowie dann zu, wenn eine Verwertung unterbleibt oder von der Entscheidung Dritte abhängt. Auf das Aufnahmehonorar werden in diesem Fall keine Preisreduktionen gewährt.

7.4 Im Zuge der Durchführung der Arbeiten vom Vertragspartner gewünschten Änderungen gehen zu seinen Lasten.

7.5 Konzeptionelle Leistungen (Beratung, Layout, sonstige grafische Leistungen etc.) sind im Aufnahmehonorar nicht enthalten. Dasselbe gilt für eienn überdurchschnittlichen organisatorischen Aufwand oder einen solchen Besprechungsaufwand.

7.6 Das Honorar versteht sich zuzüglich Umsatzsteuer in ihrer jeweiligen gesetzlichen Höhe.

8. Lizenzhonorar

8.1 So ferne nicht ausdrücklich schriftlich etwas anderes vereinbart ist, steht dem Fotografen im Fall der Erteilung einer Nutzungsbewilligung ein Veröffentlichungshonorar in vereinbarter oder angemessener Höhe gesondert zu.

8.2 Das Veröffentlichungshonorar versteht sich zuzüglich Umsatzsteuer in ihrer jeweiligen gesetzlichen Höhe.

8.3 Unbeschadet aller gesetzlichen Ansprüche nach den §§ 81ff und 91ff UrhG gilt im Fall der Verletzung der Urheber- und/oder Leistungsschutzrechte an den vertragsgegenständlichen Aufnahmen folgendes: Die Ansprüche nach § 87 UrhG stehen unabhängig von einem Verschulden zu. Im Fall der Verletzung des Rechts auf Herstellerbezeichnung steht als immaterieller Schaden (§ 87 Abs. 2 UrhG) vorbehaltlich eines hinzukommenden Vermögensschadens (§ 87 Abs. 1 UrhG) zumindest ein Betrag in der Höhe des angemessenen Entgelts (§86 UrhG) zu. Der Auskunftsanspruch nach § 87a Abs. 1 UrhG gilt auch für den Beseitigungsanspruch.

9. Zahlung

9.1 Mangels anderer ausdrücklicher schriftlicher Vereinbarung ist bei Auftragserteilung eine Akontozahlung in der Höhe von 50% der voraussichtlichen Rechnungssumme zu leisten. So ferne nicht ausdrücklich schriftlich etwas anderes vereinbart ist, ist das Resthonorar nach Rechnungslegung sofort bar zur Zahlung fällig. So ferne kein Zahlungsziel vereinbart wird, sind die gelegten Rechnungen längsten binnen 8 Tagen ab Rechnungslegung zur Zahlung fällig. Die Rechnungen sind ohne jeden Abzug und spesenfrei zahlbar. Im Fall der Übersendung (Postanweisung, Bank- oder Postsparkassenüberweisung etc.) gilt die Zahlung erst mit Verständigung des Fotografen vom Zahlungseingang als erfolgt. Das Risiko des Postwegs gerichtlicher Eingaben (Klagen, Exekutionsanträge) gehen zu Lasten des Vertragspartners. Verweigert der Vertragspartner (Auftraggeber) die Annahme wegen mangelhafter Erfüllung oder macht er Gewährleistungsansprüche geltend, ist das Honorar gleichwohl zur Zahlung fällig.

9.2 Bei Aufträgen, die mehrere Einheiten umfassen, ist der Fotografn berechtigt, nach Lieferung jeder Einzelleistung Rechnung zu legen.

9.3 Im Fall des Verzugs gelten – unbeschadet übersteigender Schadenersatzansprüche – Zinsen und Zinseszinsen in der Höhe von 5% über der jeweiligen Bankrate ab dem Fälligkeitstag als vereinbart. Für Zwecke der Zinsenberechnung ist für das jeweilige Kalenderjahr die am 2. Jänner des entsprechenden Jahres festgesetzte Bankrate für das gesamte Kalenderjahr maßgebend.

9.4 Mahnspesen und die Kosten – auch außergerichtlicher – anwaltlicher Intervention gehen zu Lasten des Vertragspartners.

9.5 Soweit gelieferte Bilder ins Eigentum des Vertragspartners übergehen, geschieht dies erst mit vollständiger Bezahlung des Aufnahmehonorars samt Nebenkosten.

10. Verwendung von Bildnissen zu Werbezwecken des Fotografen:

Der Fotograf ist sofern keine ausdrückliche gegenteilige schriftliche Vereinbarung besteht berechtigt von ihm hergestellte Lichtbilder zur Bewerbung seiner Tätigkeit zu verwenden. Der Vertragspartner erteilt zur Veröffentlichung zu Werbezwecken des Fotografen seine ausdrückliche und unwiderrufliche Zustimmung und verzichtet auf die Geltendmachung jedweder Ansprüche, insbesondere aus dem Recht auf das eigene Bild gem. § 78 UrhG sowie auf Verwendungsansprüche gem. § 1041 ABGB.

Der Vertragspartner erteilt auch unter Berücksichtigung der geltenden Datenschutzbestimmungen seine Einwilligung, dass seine personenbezogenen Daten und insbesondere die hergestellten Lichtbilder im Sinne einer Veröffentlichung zu Werbezwecken des Fotografen verarbeitet werden

11. Stornogebühren

Nimmt der Vertragspartner von der Durchführung des erteilten Auftrags aus welchen Gründen immer Abstand, steht dem Fotografen mangels anderer Vereinbarung folgende Stornogebühren zu:

ab Zeitpunkt der Buchung 10% des Honorars

12 Monate vor Buchungstermin 25% des Honorars

6 Monate vor Buchungstermin 50% des Honorars

2 Monate vor Buchungstermin 75% des Honorars

ab 2 Wochen vor Buchungstermin 100% des Honorars

Im Fall unbedingt erforderlicher Terminänderung (z.B. aus Gründen der Wetterlage) sind ein dem vergeblich erbracht bzw. reservierte Zeitaufwand entsprechendes Honorar und alle Nebenkosten zu bezahlen.  Durch den Auftrag anfallende Kosten und Auslagen sind nicht im Honorar enthalten und gehen zu Lasten des Auftraggebers.

12. Datenschutz:

Der Vertragspartner erklärt sich ausdrücklich damit einverstanden, dass der Fotograf die von ihm bekanntgegebenen Daten (Name, Adresse, E-Mail, Kreditkartendaten, Daten für Kontoüberweisungen, Telefonnummer) für Zwecke der Vertragserfüllung und Betreuung sowie für eigene Werbezwecke automations-unterstützt ermittelt, speichert und verarbeitet. Weiters ist der Vertragspartner einverstanden, dass ihm elektronische Post zu Werbezwecken bis auf Widerruf zugesendet wird. Der Vertragspartner nimmt folgende Datenschutzmitteilung, soferne diesem nicht eine weiterführende Mitteilung zugegangen ist, zur Kenntnis und bestätigt,dass der Fotograf damit die ihn treffenden Informationspflichten erfüllt hat:

Der Fotograf als Verantwortlicher verarbeitet depersonenbezogenen Daten des Vertragspartners wie folgt:

12.1

Zweck der Datenverarbeitung:

Der Fotograf verarbeitet die unter Punkt 2. genannten personenbezogenen Daten zur Ausführung des geschlossenen Vertrages und / oder der vom Vertragspartner angeforderten Bestellungen bzw. zur Verwendung der Bildnisse zu Werbezwecken des Fotografen, darüber hinaus die weitersbekanntgegebenen personenbezogenen Daten für die eigene Werbezwecke des Fotografen. Die angeboten Preise inkludieren alle Veröffentlichungsrechte der Lichtbildwerke für den Fotografen, bei nicht zustimmung fällt eine Gebühr von €350,- ab

12.2

Verarbeitete Datenkategorien und Rechtsgrundlagen der Verarbeitung:

Der Fotograf verarbeitet die personenbezogenen Daten, nämlich Name, Anschrift, Telefon-und Telefaxnummer, E-Mail-Adressen, Bankverbindung und Bilddaten, um die unter Punkt 1. genannten Zwecke zu erreichen.

12.3

Übermittlung der personenbezogenen Daten des Vertragspartners:

Zu den oben genannten Zwecken werden die personenbezogenen Daten des Vertragspartners, wenn dies Inhalt des Vertrages ist, auf Anfrage des Vertragspartners namentlich zu nennende Empfänger übermittelt, nämlich insbesondere an dem geschlossenen Vertrag nahestehende Dritte, sofern dies Vertragsinhalt ist, Medien, sollte diesbezüglich eine Vereinbarung mit dem Vertragspartner bestehen und gegebenenfalls in die Vertragsabwicklung involvierte Dritte.

12.4

Speicherdauer:

Die personenbezogenen Daten des Vertragspartners werden vom Fotografen nur solange aufbewahrt, wie dies von vernünftiger Weise als notwendig erachtet wird, um die unter Punkt 1. genannten Zwecke zu erreichen und wie dies nach an-

wendbarem Recht zulässig ist. Die personenbezogenen Daten des Vertragspartners werden solange gesetzlich Aufbewahrungspflichten bestehen oder Verjährungsfristen potentieller Rechtsansprüche noch nicht abgelaufen sind, gespeichert.10

12.5

Die Rechte des Vertragspartners im Zusammenhang mit personenbezogenen Daten:Nach geltendem Recht ist der Vertragspartner unter anderem berechtigt

•zu überprüfen, ob und welche personenbezogenen Daten der Fotograf gespeichert hat um Kopien dieser Daten –ausgenommen die Lichtbilder selbst –zu erhalten

•die Berichtigung, Ergänzung oder das Löschen seiner personenbezogenen Daten, die falsch sind oder nicht rechtskonform verarbeitetwerden,zu verlangen

•vom Fotografen zu verlangen, die Verarbeitung der personenbezogenen Daten sofern die gesetzlichen Voraussetzungen vorliegen –einzuschränken

•unter bestimmten Umständen der Verarbeitung seiner personenbezogenen Daten zu widersprechen oder die für das Verarbeiten zuvor gegebene Einwilligung zu widerrufen

•Datenübertragbarkeit zu verlangen

•die Identität von Dritten, an welche die personenbezogenen Daten übermittelt werden, zu kennen und

•bei Vorliegen der gesetzlichen Voraussetzungen bei der zuständigen Behörde Beschwerde zu erheben

12.6

Kontaktdaten des Verantwortlichen:

Sollte der Vertragspartner zur Verarbeitung seiner personenbezogenen Daten Fragen und Anliegen haben, kann sich dieser an den ihm namentlich und anschriftlich bekannten Fotografen wenden.

13 Schlussbestimmungen

13.1 Erfüllungsort und Gerichtsstand ist der Betriebssitz des Fotografen. Im Fall der Sitzverlegung können Klagen am alten und am neuen Betriebssitz anhängig gemacht werden.

13.2 Das Produkthaftpflichtgesetz (PHG) ist nicht anwendbar; jedenfalls wird eine Haftung für andere als Personenschäden ausgeschlossen, wenn der Vertragspartner Unternehmer ist. Im übrigen ist österreichisches Recht anwendbar, das auch dem internationalen Kaufrecht vorgeht.

13.3 Das Schad- und Klagloshalten umfasst auch die Kosten außergerichtlicher Rechtsverteidigung.

13.4 Diese Allgemeinen Geschäftsbedingungen gelten insoweit nicht, als zwingende Bestimmungen des KSchG entgegenstehen. Teilnichtigkeit einzelner Bestimmungen (des Vertrags) berührt nicht die Gültigkeit der übrigen Vertragsbestimmungen.

13.5 Diese Allgemeinen Geschäftsbedingungen gelten für von Fotografen auftragsgemäß hergestellte Filmwerke oder Laufbilder sinngemäß, und zwar unabhängig von dem angewendeten Verfahren und der angewendeten Technik (Schmalfilm, Video, DAT etc.).

Ich nutze zur Erbringung meiner Leistung gegenüber meinen Kunden den Dienst [https://app.hochzeit.management](https://app.hochzeit.management/). Dieser bietet mir insbesondere die Möglichkeit Stammdaten der von mir betreuten Kunden/Brautpaare anzulegen, eine Kalenderverwaltung, eine Aufgaben-/To-Do-Liste, ein Postfach zur Kommunikation zwischen mir und meinen Kunden sowie die Möglichkeit direkt über den Dienst Angebote und Abrechnungen für die Leistungen des Users zu erstellen. Angeboten wird dieser Dienst von der Hochzeit.Management GmbH, mit welcher ich einen Nutzungsvertrag sowie einen – datenschutzrechtlich notwendigen – Auftragsverarbeitungsvertrag habe.`;

// Funktion zum Konvertieren von Markdown zu HTML
function markdownToHtml(markdown: string): string {
  let html = markdown;
  
  // Überschriften
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Fettdruck
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // Zeilenumbrüche zu Absätzen
  html = html.split('\n\n').map(para => {
    if (para.trim() && !para.match(/^<[h|a|strong]/)) {
      return `<p>${para.trim()}</p>`;
    }
    return para;
  }).join('\n');
  
  // Einzelne Zeilenumbrüche
  html = html.replace(/\n/g, '<br />');
  
  return html;
}

async function migrateLegalPages() {
  console.log('🚀 Starte Migration der Legal Pages...\n');

  const pages = [
    {
      slug: 'impressum',
      title: 'Impressum',
      content: markdownToHtml(impressumContent),
      page_type: 'legal',
      published: true,
      meta_title: 'Impressum | DZ-Photo',
      meta_description: 'Impressum - Angaben gemäß § 5 TMG für Daniel Zangerle - DZ-Photo',
    },
    {
      slug: 'datenschutzerklaerung',
      title: 'Datenschutzerklärung',
      content: markdownToHtml(datenschutzContent),
      page_type: 'legal',
      published: true,
      meta_title: 'Datenschutzerklärung | DZ-Photo',
      meta_description: 'Datenschutzerklärung für Daniel Zangerle - DZ-Photo',
    },
    {
      slug: 'agb',
      title: 'Allgemeine Geschäftsbedingungen',
      content: markdownToHtml(agbContent),
      page_type: 'legal',
      published: true,
      meta_title: 'AGB | DZ-Photo',
      meta_description: 'Allgemeine Geschäftsbedingungen für Daniel Zangerle - DZ-Photo',
    },
  ];

  for (const page of pages) {
    try {
      const { data, error } = await supabase
        .from('pages')
        .upsert(page, { onConflict: 'slug' })
        .select()
        .single();

      if (error) {
        console.error(`❌ Fehler bei ${page.slug}:`, error);
      } else {
        console.log(`✅ ${page.title} migriert (ID: ${data.id})`);
      }
    } catch (err) {
      console.error(`❌ Fehler bei ${page.slug}:`, err);
    }
  }

  // Update site_settings mit echten Kontaktdaten
  console.log('\n📝 Aktualisiere site_settings mit echten Kontaktdaten...');
  
  const { data: existingSettings, error: fetchError } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('❌ Fehler beim Abrufen der Settings:', fetchError);
  } else {
    const settingsUpdate = {
      contact_email: 'office@dz-photo.at',
      contact_phone: '+43 664 3900990',
    };

    if (existingSettings) {
      const { error: updateError } = await supabase
        .from('site_settings')
        .update(settingsUpdate)
        .eq('id', existingSettings.id);

      if (updateError) {
        console.error('❌ Fehler beim Aktualisieren der Settings:', updateError);
      } else {
        console.log('✅ Site Settings aktualisiert');
      }
    } else {
      const { error: insertError } = await supabase
        .from('site_settings')
        .insert({
          ...settingsUpdate,
          site_name: 'DZ-Photo',
          site_description: 'Professionelle Hochzeitsfotografie in Oberösterreich',
        });

      if (insertError) {
        console.error('❌ Fehler beim Einfügen der Settings:', insertError);
      } else {
        console.log('✅ Site Settings erstellt');
      }
    }
  }

  console.log('\n✅ Migration abgeschlossen!');
}

migrateLegalPages().catch(console.error);

