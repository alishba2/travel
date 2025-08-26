/* eslint-disable consistent-return */
/* eslint-disable no-bitwise */
import Excel from 'exceljs';
import * as XLSX from 'xlsx';
import dayjs from 'dayjs';
import { saveAs } from 'file-saver';
import { ExcelDownloadPayload } from '@typings/payload';

interface IReturn {
	excelDownload: (payload: ExcelDownloadPayload) => Promise<void>;
	convertToListByExcel: (file: ArrayBuffer) => any[];
}

const useExcel = (): IReturn => {
	/**
	 * ## 엑셀 다운로드
	 * @param { Object } ExcelDownloadPayload - payload
	 * @param { string } ExcelDownloadPayload.fileName - 엑셀 파일 이름
	 * @param { string } ExcelDownloadPayload.sheetName - 엑셀 시트 이름
	 */

	const excelDownload = async ({
		fileName = `DIY_${dayjs(new Date()).format('YYYY-MM-DD')}.xlsx`,
		sheetName = `DIY_${dayjs(new Date()).format('YYYY-MM-DD')}`,
		header,
		headerGap = 0,
		list,
	}: ExcelDownloadPayload) => {
		try {
			const columns = Object.keys(header).map((o: any) => ({
				key: o,
				header: header[o],
				width: 25,
			}));
			const workbook = new Excel.Workbook();
			const workSheet = workbook.addWorksheet(sheetName);
			workSheet.columns = columns;

			if (headerGap) {
				const gap = [];
				for (let i = 0; i < headerGap; i += 1) {
					gap.push(['-']);
				}
				workSheet.spliceRows(1, 0, ...gap);
			}

			list.forEach((element: any) => {
				workSheet.addRow(element);
			});

			return workbook.xlsx
				.writeBuffer()
				.then((buffer: BlobPart) => {
					saveAs(new Blob([buffer]), `${fileName}`);
				})
				.catch((error: any) => {
					console.log(error);
				});
		} catch (e) {
			console.error(`excelDownload : ${e}`);
		}
	};

	const convertToListByExcel = (file: ArrayBuffer) => {
		try {
			if (file) {
				const workbook = XLSX.read(file, { type: 'binary', cellText: false, cellDates: true });
				const sheetName = workbook.SheetNames[0];
				const worksheet = workbook.Sheets[sheetName];

				const result = XLSX.utils.sheet_to_json(worksheet, {
					defval: '',
				});

				return result;
			}
		} catch (error) {
			console.error(error);
		}
		return [];
	};

	return { excelDownload, convertToListByExcel };
};

export default useExcel;
