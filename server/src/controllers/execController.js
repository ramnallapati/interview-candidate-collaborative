import { runCodeInSandbox } from '../utils/sandbox.js';


export const executeCode = async (req, res, next) => {
  try {
    const { language, code, stdin } = req.body;
    
    if (!language || !code) {
      return res.status(400).json({
        success: false,
        message: 'Language and code are required'
      });
    }

    const result = await runCodeInSandbox({ language, code, stdin });
    res.json({
      success: true,
      result
    });
  } catch (err) {
    next(err);
  }
};