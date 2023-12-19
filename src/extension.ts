// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { VswizardCodeLensProvider } from "./providers/VswizardCodeLenProvider";
import { GenerateDocstring } from './providers/GenerateDocstringProvider';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vswizard" is now active!');

	// Step1: generate client uid

	// Step2: register code lens
	const vswizardCodeLensProvider = new VswizardCodeLensProvider(); 
	vscode.languages.registerCodeLensProvider("python", vswizardCodeLensProvider);


	// Step3: register commands
	context.subscriptions.push(
		vscode.commands.registerCommand(
			"vswizard.generateDocstring",
			async (text: string="", insertionLine:number=-1) => {
				console.debug(`[genDocstring] text: ${text}`);
				// call command not from Code Lens
				if (!text || text === undefined || insertionLine === -1) {
					console.debug("[genDocstring] trigger from: editor selection");
					const editor = vscode.window.activeTextEditor;
					if (!editor) {return ;}

					text = editor.document.getText(editor.selection);
					insertionLine = editor.selection.start.line;
					console.debug(`[genDocstring] text: ${text}, insertionLine: ${insertionLine}`);
				}

				vscode.window.withProgress(
					{
						location: vscode.ProgressLocation.Notification,
						title: "vswizard",
						cancellable: true
					}, async (progress) => {
						progress.report({
							message: `Generating Docstring...`,
						});
						const res = await GenerateDocstring(text, insertionLine, "");
					}
				);
			}
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			"vswizard.generateFileHeader",
			async () => {

			}
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			"vswizard.generateCompletion",
			async () => {

			}
		)
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}